// IMPORT PACKAGE
const global = require('../global');
const emailValidator = require('email-validator');
const mongoose = require('mongoose');
// const { ObjectId } = require('mongodb');
// const ObjectID = require('mongodb').ObjectID;

// IMPORT MODEL
const User = require('../models/user');

// VALIDATE UPDATE USER (PUT)
exports.validateUpdateUser = async (req, res, next) => {
    try {
        let errors = [];

        // VALIDATE NAME FIELD
        const name = req.body.name;
        if(!name || name === ''){
            // CHECK IF FIELD NAME IS EMPTY
            errors.push({
                field: "name",
                message: "Name cannot be empty",
            });
        }

        // VALIDATE EMAIL FIELD
        const email = req.body.email;
        if (!email || email === '') {
            // CHECK IF FIELD EMAIL IS EMPTY
            errors.push({
                field: "email",
                message: "Email cannot be empty"
            })
        } else if (!emailValidator.validate(email)) {
            // CHECK IF EMAIL IS VALID
            errors.push({
                field: "email",
                message: "Invalid email"
            })
        } else {
            // CHECK IF EMAIL IS ALREADY USED BY ANOTHER USER
            const user = await User.findOne({email: email, _id: {$ne: req.userId}});
            if (user) {
                errors.push({
                    field: "email",
                    message: "Email is already used by another user"
                })
            }
        }

        // IF ANY VALIDATION ERROR, THROW THE ERROR
        if(errors.length > 0){
            const error = new Error(global.ERROR_VALIDATION.MESSAGE);
            error.statusCode = global.ERROR_VALIDATION.CODE;
            error.data = errors;
            throw error;
        }

        // GO TO THE NEXT MIDDLEWARE
        next();

    } catch(error){
        // IF ERROR, GO TO THE NEXT ERROR HANDLER MIDDLEWARE
        error.statusCode = error.statusCode || global.ERROR_SERVER_GENERAL.CODE;
        error.message = error.message || global.ERROR_SERVER_GENERAL.MESSAGE;
        next(error);
    }
}
