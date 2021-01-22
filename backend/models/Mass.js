const mongoose = require('mongoose');
const reservationSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    reservationDate: {
        type: Date,
        default: new Date()
    },
    inactive: {
        type: Boolean,
        default: false
    },
    seats: {
        type: Array,
        default: []
    }    
}, {_id: true});
const massSchema = mongoose.Schema({
    date: {
        type: Date,
        required: true,        
    },
    inactive:{
        type: Boolean,
        default: false
    },
    published: {
        type: Boolean,
        default: false
    },
    reservations: [reservationSchema],
    configuration: {
        seats: Array,
        rows: Array
    }
});
module.exports = mongoose.model("Mass", massSchema);