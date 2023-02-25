const express = require("express")
const bcrypt = require("bcrypt")
const _ = require("lodash")
const { User, validate } = require("../models/usersModels.js")
const { Card } = require("../models/cardModels")
const auth = require('../middleware/authMiddleware.js')
const router = express.Router()

const getCards = async (cardsArray) => {
    const cards = await Card.find({ "bizNumber": { $in: cardsArray } });
    return cards;
};

//! display user's card
// GET http://localhost:3000/api/users/cards
router.get('/cards', auth, async (req, res) => {

    try {
        if (!req.query.numbers) res.status(400).send('Missing numbers data');

        let data = {};
        data.cards = req.query.numbers.split(",");

        const cards = await getCards(data.cards);
        res.status(200).json(cards);
    } catch (error) {
        res.status(500).send(err.message)

    }

});

//! save user's cards
// PATCH http://localhost:3000/api/users/cards
router.patch('/cards', auth, async (req, res) => {

    try {
        const { error } = validateCards(req.body);
        if (error) res.status(400).send(error.details[0].message);

        const cards = await getCards(req.body.cards);
        if (cards.length != req.body.cards.length) res.status(400).send("Card numbers don't match");

        let user = await User.findById(req.user._id);
        user.cards = req.body.cards;
        user = await user.save();
        res.status(200).json(user)

    } catch (error) {
        res.status(500).send(err.message)
    }
});


//! Login
// GET http://localhost:3000/api/users/authorized
router.get('/authorized', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
});

//! REGISTER
// POST http://localhost:3000/api/users/register

router.post("/register", async (req, res) => {
    try {
        const error = validate.validateUser.body;
        if (error) return res.status(400).send(error.details[0].message)

        let user = await User.findOne({ email: req.body.email })
        if (user) return res.status(400).send('User already registered.')

        user = new User(_.pick(req.body, ['name', 'email', 'password', 'biz', 'cards']));

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        await user.save()
        res.status(201)
        res.send(_.pick(user, ["_id", "name", "email"]))
    } catch (err) {
        res.status(500).send(err.message)
    }

})

module.exports = router