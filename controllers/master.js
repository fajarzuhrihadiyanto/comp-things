// IMPORT APP PACKAGE
const global = require('../global');
const Type = require('../models/type');
const queryUtil = require('../utils/query-util');

// GET TYPES
exports.getTypes = async (req, res, next) => {
    try {
        // GET THE DATA
        const result = await queryUtil.getDatas('Type', {}, req);

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

// GET TYPE
exports.getType = async (req, res, next) => {
    try {
        const typeId = req.params.typeId;

        // CHECK IF TYPE IS EXIST OR NOT
        const type = await Type.findById(typeId);
        if(!type) {
            const error = new Error(global.ERROR_NOT_FOUND.MESSAGE);
            error.statusCode = global.ERROR_NOT_FOUND.CODE;
            throw error;
        }

        // RETURN JSON RESPONSE
        res.status(global.SUCCESS_GENERAL.CODE).json({
            message: global.SUCCESS_GENERAL.MESSAGE,
            data: type
        })
    } catch(error){
        // IF ERROR, GO TO THE NEXT ERROR HANDLER MIDDLEWARE
        error.statusCode = error.statusCode || global.ERROR_SERVER_GENERAL.CODE;
        error.message = error.message || global.ERROR_SERVER_GENERAL.MESSAGE;
        next(error);
    }
}

// POST TYPE
exports.postType = async (req, res, next) => {
    try {
        // GET DATA FROM REQUEST'S BODY
        const name = req.body.name;
        const fields = req.body.fields;

        // CREATE NEW TYPE
        const type = await new Type({
            name: name,
            fields: fields
        }).save();

        // RETURN JSON RESPONSE
        res.status(global.SUCCESS_POST.CODE).json({
            message: global.SUCCESS_POST.MESSAGE,
            data: type
        })

    } catch(error){
        // IF ERROR, GO TO THE NEXT ERROR HANDLER MIDDLEWARE
        error.statusCode = error.statusCode || global.ERROR_SERVER_GENERAL.CODE;
        error.message = error.message || global.ERROR_SERVER_GENERAL.MESSAGE;
        next(error);
    }
}

// PUT TYPE
exports.putType = async (req, res, next) => {
    try {
        // CHECK IF TYPE IS EXIST OR NOT
        const typeId = req.params.typeId
        const type = await Type.findById(typeId);
        if(!type){
            const error = new Error(global.ERROR_NOT_FOUND.MESSAGE);
            error.statusCode = global.ERROR_NOT_FOUND.CODE;
            throw error;
        }

        // GET DATA FROM REQUEST'S BODY
        const name = req.body.name;
        const fields = req.body.fields;

        // EDIT DATA
        type.name = name;
        type.fields = fields;

        // SAVE NEW DATA
        const result = await type.save();

        // RETURN JSON RESPONSE
        res.status(global.SUCCESS_GENERAL.CODE).json({
            message: global.SUCCESS_GENERAL.MESSAGE,
            data: result
        })
    } catch(error){
        // IF ERROR, GO TO THE NEXT ERROR HANDLER MIDDLEWARE
        error.statusCode = error.statusCode || global.ERROR_SERVER_GENERAL.CODE;
        error.message = error.message || global.ERROR_SERVER_GENERAL.MESSAGE;
        next(error);
    }
}

// DELETE TYPE
exports.deleteType = async (req, res, next) => {
    try {
        // CHECK IF TYPE IS EXIST OR NOT
        const typeId = req.params.typeId;
        let type = await Type.findById(typeId);
        if(!type){
            const error = new Error(global.ERROR_NOT_FOUND.MESSAGE);
            error.statusCode = global.ERROR_NOT_FOUND.CODE;
            throw error;
        }

        // DELETE TYPE BY ID
        type = await Type.findByIdAndRemove(typeId);

        // RETURN JSON RESPONSE
        res.status(global.SUCCESS_GENERAL.CODE).json({
            message: global.SUCCESS_GENERAL.MESSAGE,
            data: type
        })
    } catch(error){
        // IF ERROR, GO TO THE NEXT ERROR HANDLER MIDDLEWARE
        error.statusCode = error.statusCode || global.ERROR_SERVER_GENERAL.CODE;
        error.message = error.message || global.ERROR_SERVER_GENERAL.MESSAGE;
        next(error);
    }
}