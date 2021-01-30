const express = require('express');
const WeeklyMass = require('../models/WeeklyMass');
const { auth } = require('../middleware/auth');

const router = express.Router();
router.post('/', auth, async (req, res) => {
    const { day, hour, minute, configurationId, recurringReservations } = req.body;    
    try {
        if (req.body.id) {
            const entry = await WeeklyMass.findById(req.body.id);
            entry.day = day;
            entry.hour = hour;
            entry.minute = minute;
            entry.configurationId = configurationId;
            entry.recurringReservations = recurringReservations;
            await entry.save();
            return res.status(200).send(entry);
        }
        else {
            const weeklyMass = new WeeklyMass({
                day, hour, minute, configurationId, recurringReservations
            });
            const existing = await WeeklyMass.findOne({day, hour, minute});
            if (existing) throw Error('A weekly mass at that time already exists');
            await weeklyMass.save();
            return res.status(200).send(weeklyMass);
        }
    }
    catch(err) {
        res.status(400).json({errorMessage: err.message});
    }    
});

router.get('/', auth, async (req, res) => {
    try {
        const list = await WeeklyMass.find({inactive: false});
        res.status(200).send(list);
    }
    catch(err) {
        res.status(400).json({errorMessage: err.message});
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        await WeeklyMass.findByIdAndDelete(req.params.id);
        res.status(200).json({message: 'Item deleted'});
    }
    catch(err) {
        res.status(400).json({errorMessage: err.message});
    }
});

module.exports = router;