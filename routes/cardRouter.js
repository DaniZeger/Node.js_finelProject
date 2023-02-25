const express = require('express');
const _ = require('lodash');
const { Card, validateCard, generateBizNumber } = require('../models/cardModels.js');
const auth = require('../middleware/authMiddleware.js');
const router = express.Router();

let numArray = []
let randNum = Math.floor(Math.random() * 999999)
while (!numArray.includes(randNum)) {
    numArray.unshift(randNum)
}


//! delete card
// http://localhost:3000/api/cards/63f4f046319f617a3b635359
router.delete('/:id', auth, async (req, res) => {
    try {

        const card = await Card.findOneAndRemove({ _id: req.params.id, user_id: req.user._id });
        if (!card) return res.status(404).send('Card does not exsist');
        res.status(200).send('Card seccssfuly deleted');

    } catch (error) {
        res.status(500).send(error.message)
    }

});

//! update card
// PUT http://localhost:3000/api/cards/63f4f046319f617a3b635359
router.put("/:id", auth, async (req, res) => {
    try {
        const { error } = validateCard(req.body)
        if (error) return res.status(400).send(error.details[0].message);

        let card = await Card.findOneAndUpdate({ _id: req.params.id, user_id: req.user._id }, req.body);
        if (!card) return res.status(404).send('Card does not exsist');

        card = await Card.findOne({ _id: req.params.id, user_id: req.user._id });
        res.status(200).json(card)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

//! get card by id
// GET http://localhost:3000/api/cards/63f4f046319f617a3b635359
router.get('/:id', auth, async (req, res) => {
    try {
        const card = await Card.findOne({ _id: req.params.id, user_id: req.user_id })
        if (!card) return res.status(404).send('This card does not exists')
        res.status(200).json(card)
    } catch (error) {
        res.status(500).send(error.message)
    }
})

//! new card
// POST http://localhost:3000/api/cards/
router.post('/', auth, async (req, res) => {
    try {
        const { error } = validateCard(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        let card = new Card(
            {
                bizName: req.body.bizName,
                bizDescription: req.body.bizDescription,
                bizAddress: req.body.bizAddress,
                bizPhone: req.body.bizPhone,
                bizImage: req.body.bizImage ? req.body.bizImage : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
                bizNumber: numArray[0],
                user_id: req.user._id
            }
        );

        await card.save()
        res.status(201).json(card)

    } catch (error) {
        res.status(500).send(error.message)
    }

});

module.exports = router;