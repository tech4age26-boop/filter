const cloudinary = require('cloudinary').v2;
const { MongoClient, ObjectId } = require('mongodb');

// Cloudinary Config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

// Helper: Upload buffer to Cloudinary
const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'products_services' },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        uploadStream.end(buffer);
    });
};

const getCollection = async () => {
    await client.connect();
    const db = client.db('filter');
    return db.collection('product_services');
};

/* =========================
   CREATE Product / Service
========================= */
const createItem = async (req, res) => {
    try {
        const {
            providerId, name, price, category,
            subCategory, stock, sku,
            duration, serviceTypes, status,
            uom, purchasePrice
        } = req.body;

        if (!providerId || !name || !price || !['service', 'product'].includes(category)) {
            return res.status(400).json({ success: false, message: 'Invalid input data' });
        }

        let imageUrls = [];

        if (req.files && req.files.length > 0) {
            const uploads = await Promise.all(
                req.files.map(file => uploadToCloudinary(file.buffer))
            );
            imageUrls = uploads.map(u => u.secure_url);
        }

        const item = {
            providerId,
            name,
            price: parseFloat(price),
            category,
            subCategory: subCategory || null,
            stock: category === 'product' ? parseInt(stock || 0) : null,
            sku: sku || null,
            uom: category === 'product' ? uom : null,
            purchasePrice: category === 'product' ? parseFloat(purchasePrice || 0) : null,
            duration: category === 'service' ? parseInt(duration || 0) : null,
            serviceTypes:
                category === 'service'
                    ? (typeof serviceTypes === 'string' ? JSON.parse(serviceTypes) : serviceTypes || [])
                    : [],
            status: status || 'active',
            images: imageUrls,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const collection = await getCollection();
        const result = await collection.insertOne(item);

        res.status(201).json({
            success: true,
            item: { _id: result.insertedId, ...item }
        });

    } catch (error) {
        console.error('Create Item Error:', error);
        res.status(500).json({ success: false, message: 'Create failed', error: error.message });
    }
};

/* =========================
   READ Items by Provider
========================= */
const getItems = async (req, res) => {
    try {
        const { providerId } = req.query;

        if (!providerId) {
            return res.status(400).json({ success: false, message: 'Provider ID required' });
        }

        const collection = await getCollection();
        const items = await collection
            .find({ providerId })
            .sort({ createdAt: -1 })
            .toArray();

        res.status(200).json({ success: true, items });

    } catch (error) {
        console.error('Get Items Error:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

/* =========================
   UPDATE Item
========================= */
const updateItem = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = { ...req.body };

        // Remove _id from updates to avoid MongoDB immutable field error
        delete updates._id;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid ID format' });
        }

        const collection = await getCollection();

        if (updates.price) updates.price = parseFloat(updates.price);
        if (updates.purchasePrice) updates.purchasePrice = parseFloat(updates.purchasePrice);
        if (updates.stock) updates.stock = parseInt(updates.stock);
        if (updates.duration) updates.duration = parseInt(updates.duration);

        if (updates.serviceTypes && typeof updates.serviceTypes === 'string') {
            updates.serviceTypes = JSON.parse(updates.serviceTypes);
        }

        // Existing images sync
        if (updates.existingImages) {
            updates.images = JSON.parse(updates.existingImages);
            delete updates.existingImages;
        }

        // New image uploads
        if (req.files && req.files.length > 0) {
            const uploads = await Promise.all(
                req.files.map(file => uploadToCloudinary(file.buffer))
            );
            const newImages = uploads.map(u => u.secure_url);

            if (!updates.images) {
                const existing = await collection.findOne({ _id: new ObjectId(id) });
                updates.images = existing?.images || [];
            }

            updates.images = [...updates.images, ...newImages];
        }

        updates.updatedAt = new Date();

        const result = await collection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: updates },
            { returnDocument: 'after' }
        );

        // In mongodb v6+, findOneAndUpdate returns the document directly (or null)
        if (!result) {
            return res.status(404).json({ success: false, message: 'Item not found' });
        }

        res.status(200).json({ success: true, item: result });

    } catch (error) {
        console.error('Update Item Error:', error);
        res.status(500).json({ success: false, message: 'Update failed', error: error.message });
    }
};

/* =========================
   DELETE Item
========================= */
const deleteItem = async (req, res) => {
    try {
        const { id } = req.params;
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid ID format' });
        }

        const collection = await getCollection();
        const result = await collection.deleteOne({ _id: new ObjectId(id) });

        if (result.deletedCount === 0) {
            return res.status(404).json({ success: false, message: 'Item not found' });
        }

        res.status(200).json({ success: true, message: 'Item deleted successfully' });

    } catch (error) {
        console.error('Delete Item Error:', error);
        res.status(500).json({ success: false, message: 'Delete failed', error: error.message });
    }
};

module.exports = {
    createItem,
    getItems,
    updateItem,
    deleteItem
};
