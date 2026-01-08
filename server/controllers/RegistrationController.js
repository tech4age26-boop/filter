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
        console.log('Files received:', req.files ? Object.keys(req.files) : 'none');

        const {
            type,
            workshopName, ownerName, crNumber, vatNumber,
            fullName, iqamaId, mobileNumber, password,
            services, offersOutdoorServices,
            latitude, longitude, address
        } = req.body;

        // Validate required fields based on type
        if (!mobileNumber || !password) {
            return res.status(400).json({
                success: false,
                message: 'Mobile number and password are required'
            });
        }

        let logoUrl = null;

        // Connect to Mongo inside the handler for Serverless consistency
        console.log('Connecting to MongoDB...');
        try {
            await client.connect();
        } catch (dbError) {
            console.error('MongoDB connection failed:', dbError);
            return res.status(503).json({
                success: false,
                message: 'Database connection failed. Please try again.'
            });
        }

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
                return res.status(500).json({
                    success: false,
                    message: 'Logo upload failed: ' + uploadError.message
                });
            }
        }

        const providerData = {
            type: type || 'owner',
            services: services ? JSON.parse(services) : [],
            offersOutdoorServices: offersOutdoorServices === 'true',
            mobileNumber,
            createdAt: new Date()
        };

        if (type === 'workshop' || !type) {
            if (workshopName) providerData.workshopName = workshopName;
            if (ownerName) providerData.ownerName = ownerName;
            if (crNumber) providerData.crNumber = crNumber;
            if (vatNumber) providerData.vatNumber = vatNumber;

            if (latitude && longitude) {
                providerData.location = {
                    type: 'Point',
                    coordinates: [parseFloat(longitude), parseFloat(latitude)]
                };
            }
            if (address) {
                providerData.address = address;
            }
            if (logoUrl) {
                providerData.logoUrl = logoUrl;
            }
        } else {
            if (fullName) providerData.fullName = fullName;
            if (iqamaId) providerData.iqamaId = iqamaId;

            if (latitude && longitude) {
                providerData.location = {
                    type: 'Point',
                    coordinates: [parseFloat(longitude), parseFloat(latitude)]
                };
            }
            if (address) {
                providerData.address = address;
            }
            if (logoUrl) {
                providerData.logoUrl = logoUrl;
            }
        }

        // Shared hashing for both types
        if (password) {
            console.log('Hashing password...');
            const salt = await bcrypt.genSalt(10);
            providerData.password = await bcrypt.hash(password, salt);
            console.log('Password hashed successfully. Hash length:', providerData.password.length);
        } else {
            console.log('WARNING: No password provided in request!');
            return res.status(400).json({
                success: false,
                message: 'Password is required'
            });
        }

        // Insert directly using MongoDB Driver
        console.log('Inserting into MongoDB...');
        const result = await collection.insertOne(providerData);

        console.log('Provider registered successfully. ID:', result.insertedId);

        res.status(201).json({
            success: true,
            message: 'Provider registered successfully',
            providerId: result.insertedId,
            provider: {
                _id: result.insertedId,
                ...providerData
            }
        });

    } catch (error) {
        console.error('Registration Error:', error);
        console.error('Error stack:', error.stack);

        // Always return JSON, never let the function timeout
        res.status(500).json({
            success: false,
            message: 'Server Error: ' + error.message,
            error: error.message
        });
    }
};

const getProviders = async (req, res) => {
    try {
        await client.connect();
        const db = client.db('filter');
        const collection = db.collection('register_workshop');

        // Fetch all providers, sort by newest first (optional)
        const providers = await collection.find({}).sort({ createdAt: -1 }).toArray();

        res.status(200).json({
            success: true,
            providers: providers.map(p => ({
                id: p._id,
                name: p.workshopName || p.fullName,
                type: p.type,
                address: p.address,
                logoUrl: p.logoUrl,
                rating: p.rating || 0, // Default rating if not exists
                // Add distances or other calculations later
            }))
        });
    } catch (error) {
        console.error('Get Providers Error:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = {
    registerProvider,
    getProviders
};