// IMPORT APP PACKAGES
const global = require('../global');
const Technology = require('../models/technology');
const Type = require('../models/type');
const queryUtil = require('../utils/query-util');
const imageRemover = require('../utils/image-remover');

// GET TECHNOLOGIES
exports.getTechnologies = async (req, res, next) => {
    try {
        // GET THE DATA
        const result = await queryUtil.getDatas('Technology', {}, req);

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

// GET TECHNOLOGY
exports.getTechnology = async (req, res, next) => {
    try {
        // CHECK IF TECHNOLOGY IS EXIST OR NOT
        const techId = req.params.techId;
        const tech = await Technology.findById(techId);
        if(!tech){
            const error = new Error(global.ERROR_NOT_FOUND.MESSAGE);
            error.statusCode = global.ERROR_NOT_FOUND.CODE;
            throw error;
        }

        // RETURN JSON RESPONSE
        res.status(global.SUCCESS_GENERAL.CODE).json({
            message: global.SUCCESS_GENERAL.MESSAGE,
            data: tech
        })
    } catch(error){
        // IF ERROR, GO TO THE NEXT ERROR HANDLER MIDDLEWARE
        error.statusCode = error.statusCode || global.ERROR_SERVER_GENERAL.CODE;
        error.message = error.message || global.ERROR_SERVER_GENERAL.MESSAGE;
        next(error);
    }
}

// POST TECHNOLOGY
exports.postTechnology = async (req, res, next) => {
    try {
        let data = {};

        // GET DATA FROM REQUEST'S BODY
        const typeId = req.body.typeId;

        // GET DATA BASED ON TYPE
        const type = await Type.findById(typeId);
        data.typeId = type._id;
        if(Array.isArray(type.fields) && type.fields.length > 0){
            type.fields.forEach(field => {
                if(field.isRequired || req.body[field.fieldName]){
                    data[field.fieldName] = req.body[field.fieldName];
                }
            })
        }

        // DEFAULT DATA
        // data.pros = [];
        // data.cons = [];
        // data.upVotedBy = [];
        // data.usedBy = [];

        // CREATE NEW TECHNOLOGY
        const tech = await new Technology(data).save();

        // RETURN JSON RESPONSE
        res.status(global.SUCCESS_POST.CODE).json({
            message: global.SUCCESS_POST.MESSAGE,
            data: tech
        })

    } catch(error){
        // IF ERROR, GO TO THE NEXT ERROR HANDLER MIDDLEWARE
        error.statusCode = error.statusCode || global.ERROR_SERVER_GENERAL.CODE;
        error.message = error.message || global.ERROR_SERVER_GENERAL.MESSAGE;
        next(error);
    }
}

// PUT TECHNOLOGY
exports.putTechnology = async (req, res, next) => {
    try {
        let data = {};

        // CHECK IF TECHNOLOGY IS EXIST OR NOT
        const techId = req.params.techId;
        const tech = await Technology.findById(techId);
        if(!tech){
            const error = new Error(global.ERROR_NOT_FOUND.MESSAGE);
            error.statusCode = global.ERROR_NOT_FOUND.CODE;
            throw error;
        }

        // GET DATA FROM REQUEST'S BODY
        const typeId = req.body.typeId;

        // GET DATA BASED ON TYPE
        const type = await Type.findById(typeId);
        data.typeId = type._id;
        if(Array.isArray(type.fields) && type.fields.length > 0){
            type.fields.forEach(field => {
                if(req.body[field.fieldName]){
                    data[field.fieldName] = req.body[field.fieldName];
                }
            })
        }

        // CLEAR THE OLD IMAGE
        if(req.file){
            imageRemover(tech._doc[req.file.fieldname]);
        }

        if(req.files){
            tech._doc[req.files[0].fieldname].forEach(file => {
                imageRemover(file);
            })
        }

        // EDIT AND SAVE NEW DATA
        const result = await Technology.findByIdAndUpdate(techId, data, {new: true});

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

// DELETE TECHNOLOGY
exports.deleteTechnology = async (req, res, next) => {
    try {
        // CHECK IF TECHNOLOGY IS EXIST OR NOT
        const techId = req.params.techId;
        let tech = await Technology.findById(techId);
        if(!tech){
            const error = new Error(global.ERROR_NOT_FOUND.MESSAGE);
            error.statusCode = global.ERROR_NOT_FOUND.CODE;
            throw error;
        }

        // DELETE THE IMAGE IF ANY
        const type = await Type.findById(tech.typeId);
        type.fields.forEach(field => {
            if(field.fieldType === 'file'){
                imageRemover(tech._doc[field.fieldName]);
            }

            if(field.fieldType === 'arrayOfFile'){
                tech._doc[field.fieldName].forEach(file => {
                    imageRemover(file);
                })
            }
        })

        // DELETE TECHNOLOGY BY ID
        tech = await Technology.findByIdAndRemove(techId);

        // RETURN JSON RESPONSE
        res.status(global.SUCCESS_GENERAL.CODE).json({
            message: global.SUCCESS_GENERAL.MESSAGE,
            data: tech
        })
    } catch(error){
        // IF ERROR, GO TO THE NEXT ERROR HANDLER MIDDLEWARE
        error.statusCode = error.statusCode || global.ERROR_SERVER_GENERAL.CODE;
        error.message = error.message || global.ERROR_SERVER_GENERAL.MESSAGE;
        next(error);
    }
}

// UPVOTE TECHNOLOGY
exports.upvoteTechnology = async (req, res, next) => {
    try {
        // CHECK IF TECHNOLOGY IS EXIST OR NOT
        const techId = req.params.techId;
        const tech = await Technology.findById(techId);
        if(!tech){
            const error = new Error(global.ERROR_NOT_FOUND.MESSAGE);
            error.statusCode = global.ERROR_NOT_FOUND.CODE;
            throw error;
        }

        // PUSH OR PULL DATA
        if(!tech.upVotedBy.includes(req.userId)){
            tech.upVotedBy.push(req.userId);
        } else {
            tech.upVotedBy.pull(req.userId);
        }

        // SAVE NEW DATA
        const result = await tech.save();

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

// USING TECHNOLOGY
exports.useTechnology = async (req, res, next) => {
    try {
        // CHECK IF TECHNOLOGY IS EXIST OR NOT
        const techId = req.params.techId;
        const tech = await Technology.findById(techId);
        if(!tech){
            const error = new Error(global.ERROR_NOT_FOUND.MESSAGE);
            error.statusCode = global.ERROR_NOT_FOUND.CODE;
            throw error;
        }

        // PUSH OR PULL DATA
        if(!tech.usedBy.includes(req.userId)){
            tech.usedBy.push(req.userId);
        } else {
            tech.usedBy.pull(req.userId);
        }

        // SAVE NEW DATA
        const result = await tech.save();

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