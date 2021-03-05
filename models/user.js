// IMPORT EVERY PACKAGE WE NEED
const mongoose = require('mongoose');

// DEFINE THE SCHEMA
const Schema = mongoose.Schema;

// CONFIGURE THE SCHEMA
const userSchema = new Schema(
    {
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
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

// EXPORT THE MODEL
module.exports = mongoose.model('User', userSchema);