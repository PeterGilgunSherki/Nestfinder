const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // Replaced standard 'user/admin' with purpose-driven roles
    role: { type: String, enum: ['seeker', 'host', 'admin'], required: true },
    // Added for future trust & safety features
    isVerified: { type: Boolean, default: false } 
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);