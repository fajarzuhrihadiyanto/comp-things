// IMPORT PACKAGE
const global = require('../global');
const emailValidator = require('email-validator');

// IMPORT THE MODEL
const Admin = require('../models/admin');

// VALIDATE POST ADMIN
exports.validatePostAdmin = async (req, res, next) => {
    try {
        let errors = [];

        // VALIDATE NAME FIELD
        const name = req.body.name;
        if (!name || name === '') {
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
            // CHECK IF EMAIL IS ALREADY USED BY ANOTHER ADMIN
            const admin = await Admin.findOne({email: email});
            if (admin) {
                errors.push({
                    field: "email",
                    message: "Email is already used by another user"
                })
            }
        }

        // VALIDATE LEVEL FIELD
        const level = req.body.level;
        if(!level) {
            // CHECK IF FIELD LEVEL IS EMPTY
            errors.push({
                field: "level",
                message: "Level cannot be empty"
            })
        } else if(level > 5 || level < 1){
            // CHECK IF FIELD LEVEL IS INVALID
            errors.push({
                field: "level",
                message: "Level invalid"
            })
        }

        // IF ANY VALIDATION ERROR, THROW THE ERROR
        if (errors.length > 0) {
            const error = new Error(global.ERROR_VALIDATION.MESSAGE);
            error.statusCode = global.ERROR_VALIDATION.CODE;
            error.data = errors;
            throw error;
        }

        // GO TO THE NEXT MIDDLEWARE
        next();
    } catch (error) {
        // IF ERROR, GO TO THE NEXT ERROR HANDLER MIDDLEWARE
        error.statusCode = error.statusCode || global.ERROR_SERVER_GENERAL.CODE;
        error.message = error.message || global.ERROR_SERVER_GENERAL.MESSAGE;
        next(error);
    }
}

// VALIDATE PUT ADMIN
exports.validatePutAdmin = async (req, res, next) => {
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
            // CHECK IF EMAIL IS ALREADY USED BY ANOTHER ADMIN
            const admin = await Admin.findOne({email: email, _id: {$ne: req.adminId}});
            if (admin) {
                errors.push({
                    field: "email",
                    message: "Email is already used by another admin"
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