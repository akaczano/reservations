const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const config = require('../config/keys');
const User = require('../models/User');
const {auth} = require('../middleware/auth');

const router = express.Router();

router.post('/login', async (req, res) => {
    const {username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ errorMessage: 'Please enter a username and password'});
    }

    try {
        const user = await User.findOne({ username });
        if (!user) throw Error('User does not exist');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw Error('Invalid credentials');

        const token = jwt.sign({ id: user._id }, config.secret, { expiresIn: 3600 });
        if (!token) throw Error("Couldn't sign the token");

        res.status(200).json({
            token,
            user: {
                id: user._id,
                username: user.username,            
            }
        });
    }
    catch (error) {
        res.status(400).json({ errorMessage : error.message });
    }
});

router.get('/user', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) throw Error('User does not exist');
        res.json(user);
    } catch (error) {
        res.status(400).json({ errorMessage: error.message });
    }
});

module.exports = router;