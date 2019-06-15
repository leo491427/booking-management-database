const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    hashPassword: {
        type: String,
        required: true
    }
});

const model = mongoose.model('User', schema);

module.exports = model;