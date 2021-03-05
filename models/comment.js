// IMPORT EVERY PACKAGE WE NEED
const mongoose = require('mongoose');

// DEFINE THE SCHEMA
const Schema = mongoose.Schema;

// CONFIGURE THE SCHEMA
const commentSchema = new Schema({
    commentBy: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    forumId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Forum'
    },
    parentId: this,
    content: {
        type: String,
        required: true,
        minlength: 20,
        maxlength: 4096,
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
module.exports = mongoose.model('Comment', commentSchema)