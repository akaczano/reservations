const mongoose = require('mongoose');
const configSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,        
    },
    seats: {
        type: Array,
        default: []
    },
    rows: {
        type: Array,
        default: []
    },
    inactive: {
        type: Boolean,
        default: false 
    }
});

module.exports = mongoose.model('Configuration', configSchema);