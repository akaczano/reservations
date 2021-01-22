const express = require('express');
const Config = require('../models/Configuration');
const {auth} = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
    try {
        const configs = await Config.find({inactive: false});
        res.status(200).json(configs);
    }
    catch(err) {
        res.status(400).json({errorMessage: err.message});
    }
});

router.put('/', auth, async (req, res) => {
    const { name, rows, seats } = req.body;    
    try {
        const id = req.body.id;
        const config = await Config.findById(id);
        if (config) {

            await Config.findByIdAndUpdate(config._id, {
                name, rows, seats
            });
            return res.status(200).json({message: 'updated record'});
        }                     
        else {            
            const config = new Config({
                name, seats, rows
            });
            if (!name || name.length < 1) {
                throw Error('You must provide a name');
            }
            const existing = await Config.findOne({name: name, inactive: false});        
            if (existing) {
                throw Error('A configuration with that name already exists');
            }
            await config.save();
            res.status(200).json(config);
        }
    }    
    catch(err) {
        res.status(400).json({errorMessage: err.message});
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        await Config.findByIdAndUpdate(req.params.id, {
            inactive: true            
        });
        res.status(200).json({message: 'Configuration deleted'});
    }
    catch(err) {
        res.status(400).json({errorMessage: err.message});
    }
});

module.exports = router;