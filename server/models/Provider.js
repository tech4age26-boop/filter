const mongoose = require('mongoose');

const ProviderSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['workshop', 'individual'],
        required: true
    },

    // Workshop specific fields
    workshopName: String,
    crNumber: String,
    vatNumber: String,
    location: {
        latitude: Number,
        longitude: Number
    },
    logoUrl: String,
    frontPhotoUrl: String,

    // Individual specific fields
    fullName: String,
    iqamaId: String,
    mobileNumber: String,
    password: String,

    // Common fields
    services: [String],
    offersOutdoorServices: { type: Boolean, default: false },

    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Provider', ProviderSchema, 'register_workshop');
