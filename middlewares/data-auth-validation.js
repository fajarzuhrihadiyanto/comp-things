// IMPORT PACKAGE
const global = require('../global');
const emailValidator = require('email-validator');

// IMPORT MODEL
const User = require('../models/user');

// VALIDATE SIGN UP
exports.validateSignUp = async (req, res, next) => {
    try {
        let errors = [];

        // VALIDATE NAME FIELD
        const name = req.body.name;
        if (!name || name === '') {
            // CHECK IF FIELD NAME IS EMPTY
            errors.push({
                field: "name",
                message: "Name cannot be empty"
            })
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
            const user = await User.findOne({email: email});
            if (user) {
                errors.push({
                    field: "email",
                    message: "Email is already used by another user"
                })
            }
        }

        // VALIDATE PASSWORD FIELD
        const password1 = req.body.password1;
        const password2 = req.body.password2;
        if(!password1 || !password2 || password1 === '' || password2 === ''){
            // CHECK IF PASSWORD IS EMPTY
            errors.push({
                field: "password",
                message: "Password cannot be empty"
            })
        } else if(password1 !== password2){
            // CHECK IF PASSWORDS ARE NOT THE SAME
            errors.push({
                field: "password",
                message: "Password confirmation are not the same with the password"
            })
        }

        // IF ANY VALIDATION ERROR, THROW THE ERROR
        if(errors.length > 0){
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

// VALIDATE SIGN IN
exports.validateSignIn = (req, res, next) => {
    try {
        let errors = []

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
        }

        // VALIDATE PASSWORD FIELD
        const password = req.body.password;
        if (!password || password === '') {
            // CHECK IF PASSWORD IS EMPTY
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

// VALIDATE FORGOT PASSWORD
exports.validateForgotPassword = (req, res, next) => {
    try {
        let errors = [];

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

// VALIDATE RESET PASSWORD
exports.validateResetPassword = (req, res, next) => {
    try {
        let errors = [];

        // VALIDATE PASSWORD FIELD
        const password1 = req.body.password1;
        const password2 = req.body.password2;
        if(!password1 || !password2 || password1 === '' || password2 === ''){
            // CHECK IF PASSWORD IS EMPTY
            errors.push({
                field: "password",
                message: "Password cannot be empty"
            })
        } else if(password1 !== password2){
            // CHECK IF PASSWORDS ARE NOT THE SAME
            errors.push({
                field: "password",
                message: "Password confirmation are not the same with the password"
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

// VALIDATE CHANGE PASSWORD
exports.validateChangePassword = (req, res, next) => {
    try {
        let errors = [];

        // VALIDATE OLD PASSWORD FIELD
        const password = req.body.password;
        if (!password || password === '') {
            // CHECK IF OLD PASSWORD IS EMPTY
            errors.push({
                field: "old password",
                message: "Old password cannot be empty"
            })
        }

        // VALIDATE NEW PASSWORD FIELD
        const password1 = req.body.password1;
        const password2 = req.body.password2;
        if(!password1 || !password2 || password1 === '' || password2 === ''){
            // CHECK IF PASSWORD IS EMPTY
            errors.push({
                field: "new password",
                message: "New password cannot be empty"
            })
        } else if(password1 !== password2){
            // CHECK IF PASSWORDS ARE NOT THE SAME
            errors.push({
                field: "new password",
                message: "New password confirmation are not the same with the password"
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