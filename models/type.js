// IMPORT EVERY PACKAGE WE NEED
const mongoose = require('mongoose');

// DEFINE THE SCHEMA
const Schema = mongoose.Schema;

// SUB-DOCUMENTS
const constrainSchema = new Schema({
    name: {
        type: String,
        required: true,
        enum: ["min", "max", "minLength", "maxLength", "equal", "notEqual", "regex"]
    },
    value: {
        type: Schema.Types.Mixed,
        required: true
    }
})

const fieldSchema = new Schema({
    fieldName: {
        type: String,
        required: true,
    },
    fieldLabel: {
        type: String,
        required: true,
    },
    fieldType: {
        type: String,
        enum: ['text', 'number', 'date', 'textarea', 'file', 'arrayOfFile'],
        required: true,
    },
    fieldHtml: {
        type: String,
        required: true
    },
    isRequired: {
        type: Boolean,
        required: true
    },
    constrains: {
        type: [constrainSchema]
    }
})

// CONFIGURE THE SCHEMA
const typeSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    fields: {
        type: [fieldSchema],
        required: true,
        validate: value => Array.isArray(value) && value.length > 0
    }
}, {
    timestamps: true
})

// EXPORT THE MODEL
module.exports = mongoose.model('Type', typeSchema);