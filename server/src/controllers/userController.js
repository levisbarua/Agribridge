const User = require('../models/User');

// @desc    Fetch all users
// @route   GET /api/users
const getUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server err', error: error.message });
    }
};

// @desc    Fetch basic user by ID
// @route   GET /api/users/:id
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server err', error: error.message });
    }
};

// @desc    Create/Register a new user
// @route   POST /api/users
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role, location, avatar } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password, // Note: In a real app we would hash this with bcrypt before saving
            role,
            location,
            avatar
        });

        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server err', error: error.message });
    }
};

module.exports = {
    getUsers,
    getUserById,
    registerUser
};
