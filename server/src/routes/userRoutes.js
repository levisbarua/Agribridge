const express = require('express');
const router = express.Router();
const {
    getUsers,
    getUserById,
    registerUser
} = require('../controllers/userController');

router.route('/').get(getUsers).post(registerUser);
router.route('/:id').get(getUserById);

module.exports = router;
