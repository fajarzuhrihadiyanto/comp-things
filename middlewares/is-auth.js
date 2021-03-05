// IMPORT NODE PACKAGE
const jwt = require('jsonwebtoken');

// IMPORT APP MODULE
const global = require('../global');
const User = require('../models/user');

module.exports = async (req, res, next) => {
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

        // CHECK IF THE TOKEN IS VALID
        if(!decodedToken || !decodedToken.userId) {
            const error = new Error(global.ERROR_UNAUTHENTICATED.MESSAGE);
            error.statusCode = global.ERROR_UNAUTHENTICATED.CODE;
            throw error;
        }

        // GET USER ID FROM THE TOKEN
        req.userId = decodedToken.userId;

        // CHECK IF SUER IS EXIST
        const user = await User.findById(req.userId);
        if(!user){
            const error = new Error(global.ERROR_UNAUTHENTICATED.MESSAGE);
            error.statusCode = global.ERROR_UNAUTHENTICATED.CODE;
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