// ? SAME AS data-auth-validation.js, KEEP USING THIS ?

// IMPORT PACKAGE
const global = require('../global');
const emailValidator = require('email-validator');

exports.validateSignInAdmin = (req, res, next) => {
    try {
        let errors = []

        // VALIDATE EMAIL FIELD
        const email = req.body.email;
        if (!email || email === '') {
            // Check if field email is empty
            errors.push({
                field: "email",
                message: "Email cannot be empty"
            })
        } else if (!emailValidator.validate(email)) {
            // Check if email is valid
            errors.push({
                field: "email",
                message: "Invalid email"
            })
        }

        // VALIDATE PASSWORD FIELD
        const password = req.body.password;
        if (!password || password === '') {
            // Check if password is empty
            errors.push({
                field: "password",
                message: "Password cannot be empty"
            })
        }

        // IF ANY VALIDATION ERROR, THROW THE ERROR
        if (errors.length > 0) {
            const error = new Error(global.ERROR_VALIDATION.MESSAGE);
            error.statusCode = global.ERROR_VALIDATION.CODE;
            error.data = errors;
            throw error
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

exports.validateChangePasswordAdmin = (req, res, next) => {
    try {
        let errors = [];

        // VALIDATE OLD PASSWORD FIELD
        const password = req.body.password;
        if (!password || password === '') {
            // Check if password is empty
            errors.push({
                field: "old password",
                message: "Old password cannot be empty"
            })
        }

        // VALIDATE NEW PASSWORD FIELD
        const password1 = req.body.password1;
        const password2 = req.body.password2;
        if (!password1 || !password2 || password1 === '' || password2 === '') {
            // Check if password is empty
            errors.push({
                field: "new password",
                message: "New password cannot be empty"
            })
        } else if (password1 !== password2) {
            // Check if passwords are not the same
            errors.push({
                field: "new password",
                message: "New password confirmation are not the same with the original new password"
            })
        }

        // IF ANY VALIDATION ERROR, THROW THE ERROR
        if (errors.length > 0) {
            const error = new Error(global.ERROR_VALIDATION.MESSAGE);
            error.statusCode = global.ERROR_VALIDATION.CODE;
            error.data = errors;
            throw error
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