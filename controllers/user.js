// IMPORT APP PACKAGE
const global = require('../global');
const User = require('../models/user');

// GET USER DATA
exports.getUser = async (req, res, next) => {
    try {
        // GET THE DATA
        const userId = req.userId;

        // CHECK IF USER EXIST OR NOT
        const user = await User.findById(userId).select('-password');
        if(!user){
            const error = new Error(global.ERROR_NOT_FOUND.MESSAGE);
            error.statusCode = global.ERROR_NOT_FOUND.CODE;
            throw error;
        }

        // RETURN JSON RESPONSE
        res.status(global.SUCCESS_GENERAL.CODE).json({
            message: global.SUCCESS_GENERAL.MESSAGE,
            data: user
        });
    } catch(error){
        // IF ERROR, GO TO THE NEXT ERROR HANDLER MIDDLEWARE
        error.statusCode = error.statusCode || global.ERROR_SERVER_GENERAL.CODE;
        error.message = error.message || global.ERROR_SERVER_GENERAL.MESSAGE;
        next(error);
    }
}

// UPDATE USER DATA
exports.putUser = async (req, res, next) => {
    try {
        // GET DATA FROM REQUEST'S BODY
        const userId = req.userId;
        const email = req.body.email;
        const name = req.body.name;

        // CHECK IF USER EXIST OR NOT
        const user = await User.findById(userId);
        if(!user){
            const error = new Error(global.ERROR_UNAUTHENTICATED.MESSAGE);
            error.statusCode = global.ERROR_UNAUTHENTICATED.CODE;
            throw error;
        }

        // EDIT DATA
        user.email = email;
        user.name = name;

        // SAVE NEW DATA
        const result = await user.save();

        // RETURN JSON RESPONSE
        res.status(global.SUCCESS_GENERAL.CODE).json({
            message: global.SUCCESS_GENERAL.MESSAGE,
            data: result
        });
    } catch(error){
        // IF ERROR, GO TO THE NEXT ERROR HANDLER MIDDLEWARE
        error.statusCode = error.statusCode || global.ERROR_SERVER_GENERAL.CODE;
        error.message = error.message || global.ERROR_SERVER_GENERAL.MESSAGE;
        next(error);
    }
}