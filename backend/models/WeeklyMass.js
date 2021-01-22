const mongoose = require('mongoose');
const weeklyMassSchema = mongoose.Schema({
    day: mongoose.Schema.Types.Number,
    hour: mongoose.Schema.Types.Number,
    minute: mongoose.Schema.Types.Number,
    configurationId: String,
    inactive: {
        type: Boolean,
        default: false
    },
    recurringReservations: [{
        firstName: {
            type: String,
            required: true   
        },
        lastName: {
            type: String,
            required: true 
        },
        seats: {
            type: Array,
            default: []
        }
    }]
});

module.exports = mongoose.model('WeeklyMass', weeklyMassSchema);