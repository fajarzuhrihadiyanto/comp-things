// IMPORT EVERY PACKAGE WE NEED
const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// IMPORT APP PACKAGE
const global = require('../global');
const User = require('../models/user');

// SIGN-UP CONTROLLER
exports.signUp = async (req, res, next) => {
    try {
        // GET DATA FROM REQUEST'S BODY
        const email = req.body.email;
        const name = req.body.name;
        const password = req.body.password1;

        // HASH THE PASSWORD
        const hashedPwd = await bcrypt.hash(password, 12);

        // CREATE NEW USER
        const user = await new User({
            email: email,
            password: hashedPwd,
            name: name
        }).save();

        // RETURN JSON RESPONSE
        res.status(global.SUCCESS_POST.CODE).json({
            message: 'Sign up success',
            userId: user._id
        })

    } catch(error){
        // IF ERROR, GO TO THE NEXT ERROR HANDLER MIDDLEWARE
        error.statusCode = error.statusCode || global.ERROR_SERVER_GENERAL.CODE;
        error.message = error.message || global.ERROR_SERVER_GENERAL.MESSAGE;
        next(error);
    }

}

// SIGN-IN CONTROLLER
exports.signIn = async (req, res, next) => {
    try {
        // GET DATA FROM REQUEST'S BODY
        const email = req.body.email;
        const password = req.body.password;

        // CHECK IF THE USER EXIST BY EMAIL
        const user = await User.findOne({email: email});
        if (!user) {
            const error = new Error(global.ERROR_UNAUTHENTICATED.MESSAGE);
            error.statusCode = global.ERROR_UNAUTHENTICATED.CODE;
            throw error;
        }

        // CHECK IF THE PASSWORD SENT AND STORED ARE THE SAME
        const passwordEquality = await bcrypt.compare(password, user.password);
        if (!passwordEquality) {
            const error = new Error(global.ERROR_UNAUTHENTICATED.MESSAGE);
            error.statusCode = global.ERROR_UNAUTHENTICATED.CODE;
            throw error;
        }

        // CREATE A TOKEN
        const token = jwt.sign({
                email: user.email,
                userId: user._id.toString()
            },
            process.env.PRIVATE_KEY,
            {expiresIn: '2h'});

        // RETURN JSON RESPONSE
        res.status(global.SUCCESS_GENERAL.CODE).json({
            message: global.SUCCESS_GENERAL.MESSAGE,
            token: token,
            userId: user._id.toString()
        })
    } catch(error){
        // IF ERROR, GO TO THE NEXT ERROR HANDLER MIDDLEWARE
        error.statusCode = error.statusCode || global.ERROR_SERVER_GENERAL.CODE;
        error.message = error.message || global.ERROR_SERVER_GENERAL.MESSAGE;
        next(error);
    }
}

// FORGOT PASSWORD CONTROLLER
exports.forgotPassword = async (req, res, next) => {
    try {
        // GET DATA FROM REQUEST'S BODY
        const email = req.body.email;

        // CHECK IF THE USER EXIST BY EMAIL
        const user = await User.findOne({email: email});
        if (!user) {
            const error = new Error(global.ERROR_UNAUTHENTICATED.MESSAGE);
            error.statusCode = global.ERROR_UNAUTHENTICATED.CODE;
            throw error;
        }

        // CREATE AN EMAIL TRANSPORTER
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_SMTP_HOST,
            port: parseInt(process.env.MAIL_SMTP_PORT),
            secure: parseInt(process.env.MAIL_SMTP_SECURE) !== 0,
            auth: {
                user: process.env.MAIL_AUTH_USER,
                pass: process.env.MAIL_AUTH_PASSWORD
            }
        });

        // CREATE A TOKEN FOR PASSWORD RESET
        const token = jwt.sign({
                email: user.email,
                userId: user._id.toString(),
                action: global.ACTION_RESET_PASSWORD
            },
            process.env.PRIVATE_KEY,
            {expiresIn: '1h'});

        // GENERATE LINK FOR PASSWORD RESET
        const link =
            process.env.FRONTEND_SERVER_HOST + ":" +
            process.env.FRONTEND_SERVER_PORT + '/' +
            process.env.FRONTEND_SERVER_FORGOT_PASSWORD_PATH + '/' +
            token

        // SEND MAIL
        const info = await transporter.sendMail({
            from: process.env.MAIL_AUTH_USER,
            to: user.email,
            subject: "Forgot Password",
            html: global.EMAIL_FORGOT_PASSWORD(link)
        })

        // RETURN JSON RESPONSE
        res.status(global.SUCCESS_GENERAL.CODE).json({
            message: global.SUCCESS_GENERAL.MESSAGE,
            data: user.email
        })
    } catch(error){
        // IF ERROR, GO TO THE NEXT ERROR HANDLER MIDDLEWARE
        error.statusCode = error.statusCode || global.ERROR_SERVER_GENERAL.CODE;
        error.message = error.message || global.ERROR_SERVER_GENERAL.MESSAGE;
        next(error);
    }
}

// RESET PASSWORD CONTROLLER
exports.resetPassword = async (req, res, next) => {
    try {
        // CHECK IF THERE IS AN AUTHORIZATION HEADER IN THE REQUEST
        if(!req.get('Authorization')){
            const error = new Error(global.ERROR_UNAUTHENTICATED.MESSAGE);
            error.statusCode = global.ERROR_UNAUTHENTICATED.CODE;
            throw error;
        }

        // GET THE TOKEN
        const token = req.get('Authorization').split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.PRIVATE_KEY);

        // CHECK IF THE TOKEN EXIST AND IS VALID
        if(!decodedToken
            || !decodedToken.action
            || decodedToken.action !== global.ACTION_RESET_PASSWORD
            || !decodedToken.email) {
            const error = new Error(global.ERROR_UNAUTHENTICATED.MESSAGE);
            error.statusCode = global.ERROR_UNAUTHENTICATED.CODE;
            throw error;
        }

        // CHECK IF THE USER EXIST BY EMAIL
        const user = await User.findOne({email: decodedToken.email});
        if(!user){
            const error = new Error(global.ERROR_UNAUTHENTICATED.MESSAGE);
            error.statusCode = global.ERROR_UNAUTHENTICATED.CODE;
            throw error;
        }

        // GET DATA FROM REQUEST'S BODY
        const password = req.body.password1;


        // EDIT USER'S PASSWORD
        const hashedPwd = await bcrypt.hash(password, 12);
        user.password = hashedPwd;
        const result = await user.save();

        // RETURN JSON RESPONSE
        res.status(global.SUCCESS_GENERAL.CODE).json({
            message: global.SUCCESS_GENERAL.MESSAGE,
        })

    } catch(error){
        // IF ERROR, GO TO THE NEXT ERROR HANDLER MIDDLEWARE
        error.statusCode = error.statusCode || global.ERROR_SERVER_GENERAL.CODE;
        error.message = error.message || global.ERROR_SERVER_GENERAL.MESSAGE;
        next(error);
    }
}

// CHANGE PASSWORD CONTROLLER
exports.changePassword = async (req, res, next) => {
    try {
        // GET DATA FROM REQUEST'S BODY
        const oldPassword = req.body.password;
        const newPassword = req.body.password1;

        // CHECK IF THE USER EXIST
        const userId = req.userId;
        const user = await User.findById(userId);
        if (!user) {
            const error = new Error(global.ERROR_NOT_FOUND.MESSAGE);
            error.statusCode = global.ERROR_NOT_FOUND.CODE;
            throw error;
        }

        // CHECK THE OLD PASSWORD
        const passwordEquality = await bcrypt.compare(oldPassword, user.password);
        if (!passwordEquality) {
            const error = new Error(global.ERROR_UNAUTHENTICATED.MESSAGE);
            error.statusCode = global.ERROR_UNAUTHENTICATED.CODE;
            throw error;
        }

        // EDIT USER'S PASSWORD
        user.password = await bcrypt.hash(newPassword, 12);
        const result = await user.save();

        // RETURN JSON RESPONSE
        res.status(global.SUCCESS_GENERAL.CODE).json({
            message: global.SUCCESS_GENERAL.MESSAGE,
        })

    } catch(error){
        // IF ERROR, GO TO THE NEXT ERROR HANDLER MIDDLEWARE
        error.statusCode = error.statusCode || global.ERROR_SERVER_GENERAL.CODE;
        error.message = error.message || global.ERROR_SERVER_GENERAL.MESSAGE;
        next(error);
    }
}