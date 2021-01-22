const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    username: String,
    password: String,
    permissions: Array
});

module.exports = mongoose.model("User", userSchema);