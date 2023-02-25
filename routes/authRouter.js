const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
const { User, validate } = require('../models/usersModels.js');
const express = require('express');
const router = express.Router();

//! Login
// POST http://localhost:3000/api/auth
router.post('/', async (req, res) => {
    try {
        const { error } = validate.validateAuth(req.body)
        if (error) return res.status(400).send(error.details[0].message)

        let user = await User.findOne({ email: req.body.email })
        if (!user) return res.status(400).send('Invalide email or password')

        const validePassword = await bcrypt.compare(req.body.password, user.password)
        if (!validePassword) return res.status(400).send('Invalide email or password')

        res.json({ token: user.generateAuthToken() });
    } catch (err) {
        res.status(500).send(err.message)
    }
})



module.exports = router;