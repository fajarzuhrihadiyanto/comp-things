// IMPORT NODE PACKAGE
const jwt = require('jsonwebtoken');

// IMPORT APP MODULE
const global = require('../global');
const Admin = require('../models/admin');

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
        if(!decodedToken || !decodedToken.adminId) {
            const error = new Error(global.ERROR_UNAUTHENTICATED.MESSAGE);
            error.statusCode = global.ERROR_UNAUTHENTICATED.CODE;
            throw error;
        }

        // GET ADMIN ID FROM THE TOKEN
        req.adminId = decodedToken.adminId;

        // CHECK IF ADMIN IS EXIST
        const admin = await Admin.findById(req.adminId);
        if(!admin){
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