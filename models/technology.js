// IMPORT EVERY PACKAGE WE NEED
const mongoose = require('mongoose');

// DEFINE THE SCHEMA
const Schema = mongoose.Schema;

// SUB-DOCUMENTS
const proConSchema = new Schema({
    content: {
        type: String,
        required: true,
        minlength: 3
    },
    upVotedBy: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
        }]
    }
})

// CONFIGURE THE SCHEMA
const techSchema = new Schema({
    typeId: {
        type: Schema.Types.ObjectId,
        ref: 'Type',
        required: true
    },
    upVotedBy: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }]
    },
    usedBy: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }]
    },
    pros: {
        type: [proConSchema]
    },
    cons: {
        type: [proConSchema]
    }
}, {
    timestamps: true,
    strict: false
})

// EXPORT THE MODEL
module.exports = mongoose.model('Technology', techSchema);
