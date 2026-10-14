const bcrypt = require('bcrypt'); // Password encryption[cite: 1]
const jwt = require('jsonwebtoken'); // Token generation[cite: 1]
const Joi = require('joi'); // JOI validation library[cite: 1]
const User = require('../models/user');

const authSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('seeker', 'host').required() // Force user to pick a path
});

exports.register = async (req, res) => {
    try {
        // 1. Destructure role from the request body
        const { email, password, role } = req.body;

        // 2. Validate role presence fallback
        const userRole = role || 'seeker';

        // 3. Check for existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // 4. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 5. Pass userRole into User.create
        const user = await User.create({ 
            email, 
            password: hashedPassword, 
            role: userRole 
        });

        // 6. Sign JWT payload including role
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET || 'secretkey', 
            { expiresIn: '7d' }
        );

        res.status(201).json({
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        // 1. Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // 2. Validate role match (optional security check)
        if (role && user.role !== role) {
            return res.status(400).json({ 
                message: `This email is registered as a ${user.role}. Please select the correct role option.` 
            });
        }

        // 3. Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // 4. Return JWT Token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'secretkey',
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};