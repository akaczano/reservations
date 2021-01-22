const express = require('express');
const { auth, includeUser }= require('../middleware/auth');
const Mass = require('../models/Mass');
const WeeklyMass = require('../models/WeeklyMass');
const Configuration = require('../models/Configuration');
const Config = require('../models/Configuration');
const { rowSize } = require('../config/keys');

const router = express.Router();


router.post('/', auth, async (req, res) => {
    const { date, configurationId, published } = req.body;
    try {
        const existingMass = await Mass.findOne({date: Date.parse(date), inactive: false});               
        if (existingMass) throw Error('A mass at that time has already been created');
        
        const config = await Config.findById(configurationId);
        if (!config) throw Error('Configuration not found');
        
        const mass = new Mass({
            date: Date.parse(date),
            configuration: {
                rows: config.rows,
                seats: config.seats
            },
            published            
        });
        await mass.save();
        res.status(200).json(mass);
    }
    catch(err) {
        res.status(400).json({errorMessage: err.message});
    }
});

router.patch('/:id', auth, async (req, res) => {
    const { published } = req.body;
    try {
        await Mass.findByIdAndUpdate(req.params.id, {
            published
        });
        res.status(200).json({message: 'Mass updated'}) 
    }
    catch(err) {
        res.status(400).json({errorMessage: err.message});
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        await Mass.findByIdAndUpdate(req.params.id, {inactive: true});
        res.status(200).json({message: 'Mass removed'});
    }
    catch(err) {
        res.status(400).json({errorMessage: err.message});
    }
});

router.get('/', includeUser, async (req, res) => {    

    try {   
        let masses = null;
        if (req.user) {
            masses = await Mass.find({inactive: false})
        }
        else {
            masses = await Mass.find({
                inactive: false, 
                published: true,
                date: {
                    $gt: new Date()
                }
            })
        }

        const weeklyMasses = await WeeklyMass.find({});
        for (const wm of weeklyMasses) {
            let d = new Date();
            while (d.getDay() !== wm.day) {
                d = new Date(d * 1 + 24 * 60 * 60 * 1000);
            }
            d = new Date(d.setHours(wm.hour));
            d = new Date(d.setMinutes(wm.minute));
            d = new Date(d.setSeconds(0));
            d = new Date(d.setMilliseconds(0));                        
            if (d - new Date()  < 7 * 24 * 60 * 60 * 1000) {
                if (!masses.find(m => m.date * 1 == d * 1)) {
                    let newMass = new Mass({
                        date: d,
                        configuration: await Configuration.findById(wm.configurationId),
                        reservations: wm.recurringReservations,
                        published: true
                    });
                    
                    await newMass.save();
                    masses.push(newMass);
                }
            }
        }

        res.status(200).send(masses.map(m => {
            m.reservations = m.reservations.filter(r => !r.inactive);
            return m;
        }));
    }
    catch (err) {
        res.status(400).json({errorMessage: err.message});
    }
});


router.get('/:id', includeUser, (req, res) => {
    Mass.findById(req.params.id)
        .then(mass => {
            if (mass.inactive || !mass.published) {
                if (!req.user) {
                    return res.status(400).json({errorMessage: 'This mass is not available'});
                }
            }
            mass.reservations = mass.reservations.filter(r => !r.inactive);
            res.status(200).send(mass);
        })
        .catch(err => res.status(404).json({
            errorMessage: 'Mass not found'
        }));
});

router.post('/:id/reserve', includeUser, async (req, res) => {
    console.log('reservation');
    const reservation = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        seats: req.body.seats                     
    }

    if (reservation.firstName.length < 1) {
        return res.status(400).json({ errorMessage: 'First name is required.'})
    }
    else if (reservation.lastName.length < 1) {
        return res.status(400).json({ errorMessage: 'Last name is required' });
    }
    else if (reservation.seats.length < 1) {
        return res.status(400).json({ erroMessage: 'You must reserve at least one seat'});
    }

    try {
        const mass = await Mass.findById(req.params.id)
        if (!mass || mass.inactive) {
            res.status(400).json({ errorMessage: 'This mass is not available for reservations.' });
            return;
        }
        if (!mass.published) {
            if (!req.user) {
                res.status(400).json({errorMessage: 'This mass is not available for reservations.'});
                return;
            }
        }
        
        for (const r of mass.reservations.filter(r => !r.inactive)) {
            for (const s of r.seats) {
                for (const seat of reservation.seats) {
                    if (Math.floor(seat / (rowSize)) == Math.floor(s / rowSize)) {
                        if (Math.abs(seat - s) <= 3) {
                            res.status(400).json({
                                errorMessage: 'At least one of these seats is no longer available. Please refresh the page.'
                            });
                        }
                    }
                }
            }
        }        
        for (const seat of reservation.seats) {
            if (mass.configuration.seats.includes(seat)) {
                return res.status(400).json({
                    errorMessage: 'You cannot reserve this seat'
                });
            }           
            const row = Math.floor(seat / rowSize);
            if (mass.configuration.rows.includes(row)) {
                return res.status(400).json({
                    errorMessage: 'You cannot reserve this seat'
                });
            } 
        }        
        
        Mass.findByIdAndUpdate(req.params.id, {
            $push: { reservations: reservation }
        })
            .then(m => res.json(m))
            .catch(err => res.send(err));
    }
    catch (err) {
        console.log(err);
        res.sendStatus(500);        
    }    
});


router.delete('/:id/:reservationId', auth, async (req, res) => {
    try {
        const mass = await Mass.findById(req.params.id);
        if (!mass) throw Error('Mass not found');
        console.log(req.params.reservationId);        
        mass.reservations = mass.reservations.map(r =>{
            console.log(r._id);
            if (r._id == req.params.reservationId) {
                console.log('hello');
                r.inactive = true;
            }
            return r;
        });
        //await Mass.findOneAndReplace({_id: req.id}, mass);
        await mass.save();
        res.status(200).json({message: 'Reservation removed'});
    }
    catch(err) {
        res.status(400).json({errorMessage: err.message});
    }
});



module.exports = router;