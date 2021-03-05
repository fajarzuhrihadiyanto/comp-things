// IMPORT EVERY PACKAGE WE NEED
const mongoose = require('mongoose');

// DEFINE THE SCHEMA
const Schema = mongoose.Schema;

// CONFIGURE THE SCHEMA
const adminSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    level: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    }
},
{
    timestamps: true
});

// EXPORT THE MODEL
module.exports = mongoose.model('Admin', adminSchema);