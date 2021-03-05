// IMPORT EVERY PACKAGE WE NEED
const mongoose = require('mongoose');

// DEFINE THE SCHEMA
const Schema = mongoose.Schema;

// CONFIGURE THE SCHEMA
const suggestionSchema = new Schema({
    typeId: {
        type: Schema.Types.ObjectId,
        ref: 'Type',
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ["waiting", "accepted", "rejected"]
    },
    suggestedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    upVotedBy: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
        }]
    }
}, {
    timestamps: true,
    strict: false
})

// EXPORT THE MODEL
module.exports = mongoose.model('Suggestion', suggestionSchema)