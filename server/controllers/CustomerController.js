const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

const registerCustomer = async (req, res) => {
    try {
        console.log('Received customer registration request:', req.body);

        const { name, phone, email, password } = req.body;

        if (!name || !phone || !password) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }

        // Connect to Mongo inside the handler
        await client.connect();
        const db = client.db('filter');
        const collection = db.collection('customers');

        // Check if customer already exists
        const existingCustomer = await collection.findOne({
            $or: [{ phone: phone }, { email: email }]
        });

        if (existingCustomer) {
            return res.status(400).json({ success: false, message: 'Customer already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const customerData = {
            name,
            phone,
            email,
            password: hashedPassword,
            createdAt: new Date(),
            type: 'customer'
        };

        const result = await collection.insertOne(customerData);

        res.status(201).json({
            success: true,
            message: 'Customer registered successfully',
            customerId: result.insertedId,
            customer: {
                _id: result.insertedId,
                name,
                phone,
                email,
                type: 'customer'
            }
        });

    } catch (error) {
        console.error('Customer Registration Error:', error);
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};

module.exports = {
    registerCustomer
};
