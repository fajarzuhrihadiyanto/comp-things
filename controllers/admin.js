// IMPORT EVERY PACKAGE WE NEED
const random = require('randomstring');
const bcrypt = require('bcryptjs');
const nodemailer = require("nodemailer");

// IMPORT APP PACKAGE
const global = require('../global');
const Admin = require('../models/admin');
const queryUtil = require('../utils/query-util');

// GET ADMINS
exports.getAdmins = async (req, res, next) => {
    try {
        const accessorId = req.adminId;

        // CHECK IF ROLE MEET REQUIREMENT
        const accessor = await Admin.findById(accessorId).select('-password');
        if(!accessor || accessor.level < 5){
            const error = new Error(global.ERROR_UNAUTHORIZED.MESSAGE);
            error.statusCode = global.ERROR_UNAUTHORIZED.CODE;
            throw error;
        }

        // GET THE DATA
        const result = await queryUtil.getDatas('Admin', {}, req);

        // RETURN JSON RESPONSE
        res.status(global.SUCCESS_GENERAL.CODE).json({
            message: global.SUCCESS_GENERAL.MESSAGE,
            ...result
        })
    } catch(error){
        // IF ERROR, GO TO THE NEXT ERROR HANDLER MIDDLEWARE
        error.statusCode = error.statusCode || global.ERROR_SERVER_GENERAL.CODE;
        error.message = error.message || global.ERROR_SERVER_GENERAL.MESSAGE;
        next(error);
    }
}

// GET ADMIN
exports.getAdmin = async (req, res, next) => {
    try {
        const accessorId = req.adminId;
        const adminId = req.params.adminId;

        // CHECK IF ROLE MEET REQUIREMENT
        const accessor = await Admin.findById(accessorId).select('-password');
        if(!accessor || (accessor.level < 5 && accessorId != adminId)){
            const error = new Error(global.ERROR_UNAUTHORIZED.MESSAGE);
            error.statusCode = global.ERROR_UNAUTHORIZED.CODE;
            throw error;
        }

        // CHECK IF ADMINS IS EXIST OR NOT
        const admin = await Admin.findById(adminId).select('-password');
        if(!admin){
            const error = new Error(global.ERROR_NOT_FOUND.MESSAGE);
            error.statusCode = global.ERROR_NOT_FOUND.CODE;
            throw error;
        }

        // RETURN JSON RESPONSE
        res.status(global.SUCCESS_GENERAL.CODE).json({
            message: global.SUCCESS_GENERAL.MESSAGE,
            data: admin
        })
    } catch(error){
        // IF ERROR, GO TO THE NEXT ERROR HANDLER MIDDLEWARE
        error.statusCode = error.statusCode || global.ERROR_SERVER_GENERAL.CODE;
        error.message = error.message || global.ERROR_SERVER_GENERAL.MESSAGE;
        next(error);
    }
}

// POST ADMIN
exports.postAdmin = async (req, res, next) => {
    try {
        const accessorId = req.adminId;

        // CHECK IF ROLE MEET REQUIREMENT
        const accessor = await Admin.findById(accessorId).select('-password');
        if(!accessor || accessor.level < 5){
            const error = new Error(global.ERROR_UNAUTHORIZED.MESSAGE);
            error.statusCode = global.ERROR_UNAUTHORIZED.CODE;
            throw error;
        }

        // GET DATA FROM REQUEST'S BODY
        const email = req.body.email;
        const name = req.body.name;
        const level = req.body.level;

        // GENERATE RANDOM PASSWORD
        const password = random.generate(20);
        const hashedPwd = await bcrypt.hash(password, 12);

        // CREATE NEW ADMIN
        const admin = await new Admin({
            email: email,
            name: name,
            level: level,
            password: hashedPwd
        }).save();

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

        // SEND EMAIL
        const mail = await transporter.sendMail({
            from: process.env.MAIL_AUTH_USER,
            to: admin.email,
            subject: "New Admin",
            html: global.EMAIL_NEW_ADMIN_PASSWORD(password)
        });

        // RETURN JSON RESPONSE
        res.status(global.SUCCESS_POST.CODE).json({
            message: global.SUCCESS_POST.MESSAGE,
            data: admin
        });
    } catch(error) {
        // IF ERROR, GO TO THE NEXT ERROR HANDLER MIDDLEWARE
        error.statusCode = error.statusCode || global.ERROR_SERVER_GENERAL.CODE;
        error.message = error.message || global.ERROR_SERVER_GENERAL.MESSAGE;
        next(error);
    }
}

// PUT ADMIN
exports.putAdmin = async (req, res, next) => {
    try {
        const adminId = req.adminId;

        // GET DATA FROM REQUEST'S BODY
        const email = req.body.email;
        const name = req.body.name;

        // CHECK IF ADMIN IS EXIST OR NOT
        const admin = await Admin.findById(adminId);
        if(!admin){
            const error = new Error(global.ERROR_NOT_FOUND.MESSAGE);
            error.statusCode = global.ERROR_NOT_FOUND.CODE;
            throw error;
        }

        // EDIT DATA
        admin.email = email;
        admin.name = name;

        // SAVE NEW DATA
        const result = await admin.save();

        // RETURN JSON RESPONSE
        res.status(global.SUCCESS_GENERAL.CODE).json({
            message: global.SUCCESS_GENERAL.MESSAGE,
            data: result
        });
    } catch(error) {
        // IF ERROR, GO TO THE NEXT ERROR HANDLER MIDDLEWARE
        error.statusCode = error.statusCode || global.ERROR_SERVER_GENERAL.CODE;
        error.message = error.message || global.ERROR_SERVER_GENERAL.MESSAGE;
        next(error);
    }
}

// DELETE ADMIN
exports.deleteAdmin = async (req, res, next) => {
    try {
        const accessorId = req.adminId;

        // CHECK IF ROLE MEET REQUIREMENT
        const accessor = await Admin.findById(accessorId).select('-password');
        if(!accessor || accessor.level < 5){
            const error = new Error(global.ERROR_UNAUTHORIZED.MESSAGE);
            error.statusCode = global.ERROR_UNAUTHORIZED.CODE;
            throw error;
        }

        // CHECK IF ADMIN IS EXIST OR NOT
        const adminId = req.params.adminId;
        let admin = await Admin.findById(adminId);
        if(!admin){
            const error = new Error(global.ERROR_NOT_FOUND.MESSAGE);
            error.statusCode = global.ERROR_NOT_FOUND.CODE;
            throw error;
        }

        // DELETE ADMIN BY ID
        admin = await Admin.findByIdAndRemove(adminId);

        // RETURN JSON RESPONSE
        res.status(global.SUCCESS_GENERAL.CODE).json({
            message: global.SUCCESS_GENERAL.MESSAGE,
            data: admin
        })
    } catch(error) {
        // IF ERROR, GO TO THE NEXT ERROR HANDLER MIDDLEWARE
        error.statusCode = error.statusCode || global.ERROR_SERVER_GENERAL.CODE;
        error.message = error.message || global.ERROR_SERVER_GENERAL.MESSAGE;
        next(error);
    }
}