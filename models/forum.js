// IMPORT EVERY PACKAGE WE NEED
const mongoose = require('mongoose');

// DEFINE THE SCHEMA
const Schema = mongoose.Schema;

// CONFIGURE THE SCHEMA
const forumSchema = new Schema({
    initiatedBy: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    content: {
        type: String,
        required: true,
        minlength: 20,
        maxlength: 4096,
    },
    tags: {
        type: [{
                type: Schema.Types.ObjectId,
                ref: 'Technology'
            }],
        validate: val => {
            return val.length > 0
        }

    },
    upVotedBy: {
        type: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
        }]
    }
}, {
    timestamps: true
})

// EXPORT THE MODEL
module.exports = mongoose.model('Forum', forumSchema)