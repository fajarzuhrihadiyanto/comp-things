// IMPORT EVERY PACKAGE WE NEED
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// IMPORT APP PACKAGE
const global = require('../global');
const Admin = require('../models/admin');

// SIGN-IN CONTROLLER
exports.signInAdmin = async (req, res, next) => {
    try {
        // GET DATA FROM REQUEST'S BODY
        const email = req.body.email;
        const password = req.body.password;

        // CHECK IF ADMIN EXIST OR NOT
        const admin = await Admin.findOne({email: email});
        if (!admin) {
            const error = new Error(global.ERROR_UNAUTHENTICATED.MESSAGE);
            error.statusCode = global.ERROR_UNAUTHENTICATED.CODE;
            throw error;
        }

        // CHECK IF THE PASSWORD SENT AND STORED ARE THE SAME
        const passwordEquality = await bcrypt.compare(password, admin.password);
        if (!passwordEquality) {
            const error = new Error(global.ERROR_UNAUTHENTICATED.MESSAGE);
            error.statusCode = global.ERROR_UNAUTHENTICATED.CODE;
            throw error;
        }

        // CREATE A TOKEN
        const token = jwt.sign({
                email: admin.email,
                adminId: admin._id.toString()
            },
            process.env.PRIVATE_KEY,
            {expiresIn: '2h'});

        // RETURN JSON RESPONSE
        res.status(global.SUCCESS_GENERAL.CODE).json({
            message: global.SUCCESS_GENERAL.MESSAGE,
            token: token,
            adminId: admin._id.toString()
        })
    } catch(error){
        // IF ERROR, GO TO THE NEXT ERROR HANDLER MIDDLEWARE
        error.statusCode = error.statusCode || global.ERROR_SERVER_GENERAL.CODE;
        error.message = error.message || global.ERROR_SERVER_GENERAL.MESSAGE;
        next(error);
    }
}

// CHANGE PASSWORD CONTROLLER
exports.changePasswordAdmin = async (req, res, next) => {
    try {
        // GET DATA FROM REQUEST'S BODY
        const oldPassword = req.body.password;
        const newPassword = req.body.password1;

        // CHECK IF ADMIN IS EXIST OR NOT
        const adminId = req.adminId;
        const admin = await Admin.findById(adminId);
        if (!admin) {
            const error = new Error(global.ERROR_UNAUTHENTICATED.MESSAGE);
            error.statusCode = global.ERROR_UNAUTHENTICATED.CODE;
            throw error;
        }

        // CHECK THE OLD PASSWORD
        const passwordEquality = await bcrypt.compare(oldPassword, admin.password);
        if (!passwordEquality) {
            const error = new Error(global.ERROR_UNAUTHENTICATED.MESSAGE);
            error.statusCode = global.ERROR_UNAUTHENTICATED.CODE;
            throw error;
        }

        // EDIT ADMIN'S PASSWORD
        const hashedPwd = await bcrypt.hash(newPassword, 12);
        admin.password = hashedPwd;
        const result = await admin.save();

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