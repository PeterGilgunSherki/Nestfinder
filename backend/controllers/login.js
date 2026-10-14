// server/controllers/authController.js
const bcrypt = require('bcrypt'); // Required for encryption
const jwt = require('jsonwebtoken'); // Required for authentication
const Joi = require('joi'); // Required for server-side validation
const User = require('../models/user'); // Mongoose Model

// JOI Validation Schema
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

exports.login = async (req, res, next) => {
    try {
        // Validation step
        const { error } = loginSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { email, password } = req.body;

        // Mongoose query
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        // Bcrypt comparison step
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        // JWT generation step
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token, user: { id: user._id, email: user.email } });
    } catch (err) {
        next(err); // Passing to global Error Handling middleware
    }
};