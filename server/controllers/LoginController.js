const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

const login = async (req, res) => {
    try {
        const { email, phone, password, role } = req.body;

        if ((!email && !phone) || !password) {
            return res.status(400).json({ success: false, message: 'Please provide email/phone and password' });
        }

        await client.connect();
        const db = client.db('filter');

        let user = null;
        let userType = '';

        // If role is explicitly provided and NOT customer, skip customer check or prioritize provider
        // Assuming 'owner', 'cashier', 'technician', 'freelancer' imply looking in providers collection.
        const isProviderRole = role && ['owner', 'cashier', 'technician', 'freelancer'].includes(role);

        if (!isProviderRole) {
            // 1. Check Customers Collection (Search by phone OR email)
            const customersCollection = db.collection('customers');
            if (email) {
                user = await customersCollection.findOne({ email: email });
            } else if (phone) {
                user = await customersCollection.findOne({ phone: phone });
            }

            if (user) {
                userType = 'customer';
            }
        }

        // If not found in customers (or we skipped customers), check providers
        if (!user) {
            // 2. Check Providers Collection (register_workshop)
            const providersCollection = db.collection('register_workshop');

            // Map role to database type for specific search
            // role 'owner' -> type 'owner' in database
            // role 'freelancer' -> type 'individual' in database
            let searchQuery = {};

            if (role === 'owner') {
                // Owner role: search for type='owner' and mobileNumber
                searchQuery = {
                    type: 'owner',
                    mobileNumber: phone
                };
                console.log('Searching for owner with query:', searchQuery);
            } else if (email) {
                searchQuery = { email: email };
            } else if (phone) {
                // Providers store phone as 'mobileNumber'
                searchQuery = { mobileNumber: phone };
            }

            user = await providersCollection.findOne(searchQuery);

            if (user) {
                userType = user.type; // 'owner', 'workshop', or 'individual'
                console.log('Provider found with type:', userType);
            }
        }

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Check Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Return User Data (excluding password)
        const { password: _, ...userData } = user;

        // Normalize the return structure with all necessary fields
        const responseData = {
            id: user._id,
            name: user.name || user.fullName || user.ownerName || user.workshopName,
            workshopName: user.workshopName,
            ownerName: user.ownerName,
            fullName: user.fullName,
            type: userType === 'customer' ? 'customer' : user.type, // 'customer', 'owner', 'workshop', 'individual'
            email: user.email,
            phone: user.phone || user.mobileNumber,
            logoUrl: user.logoUrl || null,
            address: user.address
        };

        console.log('Login successful, returning user data:', responseData);

        res.json({
            success: true,
            message: 'Login successful',
            user: responseData
        });

    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};


const forgotPassword = async (req, res) => {
    try {
        console.log('Forgot Password request:', req.body);
        const { phone } = req.body;

        if (!phone) {
            return res.status(400).json({ success: false, message: 'Phone number is required' });
        }

        // Mock: Always success for now
        res.json({
            success: true,
            message: 'OTP sent successfully to ' + phone
        });

    } catch (error) {
        console.error('Forgot Password Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const verifyOtp = async (req, res) => {
    try {
        console.log('Verify OTP request:', req.body);
        const { phone, otp } = req.body;

        if (!phone || !otp) {
            return res.status(400).json({ success: false, message: 'Phone and OTP are required' });
        }

        // Mock: Static OTP check
        if (otp === '1234') {
            res.json({
                success: true,
                message: 'OTP verified successfully'
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Invalid OTP'
            });
        }

    } catch (error) {
        console.error('Verify OTP Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = {
    login,
    forgotPassword,
    verifyOtp
};
