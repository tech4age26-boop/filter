const cloudinary = require('cloudinary').v2;
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

// Cloudinary Config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

// Helper to upload buffer to Cloudinary
const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'providers' },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        uploadStream.end(buffer);
    });
};

const registerProvider = async (req, res) => {
    try {
        console.log('Received registration request:', req.body);

        const {
            type,
            workshopName, ownerName, crNumber, vatNumber,
            fullName, iqamaId, mobileNumber, password,
            services, offersOutdoorServices,
            latitude, longitude
        } = req.body;

        let logoUrl = null;

        // Connect to Mongo inside the handler for Serverless consistency
        await client.connect();
        const db = client.db('filter');
        const collection = db.collection('register_workshop');

        if (req.files && req.files['logo']) {
            console.log('Uploading logo to Cloudinary...');
            try {
                const result = await uploadToCloudinary(req.files['logo'][0].buffer);
                console.log('Logo uploaded:', result.secure_url);
                logoUrl = result.secure_url;
            } catch (uploadError) {
                console.error('Logo upload failed:', uploadError);
                throw new Error('Logo upload failed: ' + uploadError.message);
            }
        }

        const providerData = {
            type,
            services: services ? JSON.parse(services) : [],
            offersOutdoorServices: offersOutdoorServices === 'true',
            status: 'pending',
            createdAt: new Date()
        };

        if (type === 'workshop') {
            providerData.workshopName = workshopName;
            providerData.ownerName = ownerName;
            providerData.mobileNumber = mobileNumber; // Added mobile
            providerData.crNumber = crNumber;
            providerData.vatNumber = vatNumber;
            providerData.address = req.body.address;
            if (latitude && longitude) {
                providerData.location = {
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude)
                };
            }
            providerData.logoUrl = logoUrl;
        } else if (type === 'individual') {
            providerData.fullName = fullName;
            providerData.iqamaId = iqamaId;
            providerData.mobileNumber = mobileNumber;
            providerData.address = req.body.address;
            if (latitude && longitude) {
                providerData.location = {
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude)
                };
            }
            providerData.logoUrl = logoUrl;
        }

        // Shared hashing for both types
        if (password) {
            const salt = await bcrypt.genSalt(10);
            providerData.password = await bcrypt.hash(password, salt);
        }

        // Insert directly using MongoDB Driver
        console.log('Inserting into MongoDB...');
        const result = await collection.insertOne(providerData);

        console.log('Provider saved:', result.insertedId);
        res.status(201).json({
            success: true,
            message: 'Registration successful',
            providerId: result.insertedId,
            provider: {
                _id: result.insertedId,
                ...providerData
            }
        });

    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

module.exports = {
    registerProvider
};