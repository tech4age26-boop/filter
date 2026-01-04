require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const registrationController = require('./controllers/RegistrationController');

const app = express();
app.use(cors());
app.use(express.json());

// Request Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
});

// Multer Setup
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).fields([
    { name: 'logo', maxCount: 1 },
    { name: 'frontPhoto', maxCount: 1 }
]);

app.post('/api/register', upload, registrationController.registerProvider);

// Health check
app.get('/', (req, res) => res.send('Filter API is running'));

const PORT = process.env.PORT || 5000;
// Only listen when running locally
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
