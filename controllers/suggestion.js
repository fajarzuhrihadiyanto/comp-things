// IMPORT APP PACKAGES
const global = require('../global');
const Suggestion = require('../models/suggestion');
const Type = require('../models/type');
const queryUtil = require('../utils/query-util');

// GET SUGGESTIONS
exports.getSuggestions = async (req, res, next) => {
    try {
        // GET THE DATA
        const result = await queryUtil.getDatas('Suggestion', {}, req);

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

// GET SUGGESTION
exports.getSuggestion = async (req, res, next) => {
    try {
        // CHECK IF SUGGESTION IS EXIST OR NOT
        const suggestionId = req.params.suggestionId;
        const suggestion = await Suggestion.findById(suggestionId);
        if(!suggestion){
            const error = new Error(global.ERROR_NOT_FOUND.MESSAGE);
            error.statusCode = global.ERROR_NOT_FOUND.CODE;
            throw error;
        }

        // RETURN JSON RESPONSE
        res.status(global.SUCCESS_GENERAL.CODE).json({
            message: global.SUCCESS_GENERAL.MESSAGE,
            data: suggestion
        })
    } catch(error){
        // IF ERROR, GO TO THE NEXT ERROR HANDLER MIDDLEWARE
        error.statusCode = error.statusCode || global.ERROR_SERVER_GENERAL.CODE;
        error.message = error.message || global.ERROR_SERVER_GENERAL.MESSAGE;
        next(error);
    }
}

// POST SUGGESTION
exports.postSuggestion = async (req, res, next) => {
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
        data.status = 'waiting';
        data.suggestedBy = req.userId;
        data.upVotedBy = [];

        // CREATE NEW SUGGESTION
        const suggestion = await new Suggestion(data).save();

        // RETURN JSON RESPONSE
        res.status(global.SUCCESS_POST.CODE).json({
            message: global.SUCCESS_POST.MESSAGE,
            data: suggestion
        })
    } catch(error){
        // IF ERROR, GO TO THE NEXT ERROR HANDLER MIDDLEWARE
        error.statusCode = error.statusCode || global.ERROR_SERVER_GENERAL.CODE;
        error.message = error.message || global.ERROR_SERVER_GENERAL.MESSAGE;
        next(error);
    }
}

// PUT SUGGESTION
exports.putSuggestion = async (req, res, next) => {
    try {
        let data = {};

        // CHECK IF SUGGESTION IS EXIST OR NOT
        const suggestionId = req.params.suggestionId;
        const suggestion = await Suggestion.findById(suggestionId);
        if(!suggestion){
            const error = new Error(global.ERROR_NOT_FOUND.MESSAGE);
            error.statusCode = global.ERROR_NOT_FOUND.CODE;
            throw error;
        }

        // CHECK THE OWNERSHIP
        if(suggestion.suggestedBy.toString() !== req.userId){
            const error = new Error(global.ERROR_UNAUTHORIZED.MESSAGE);
            error.statusCode = global.ERROR_UNAUTHORIZED.CODE;
            throw error;
        }

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

        console.log(data);

        // EDIT AND SAVE NEW DATA
        const result = await Suggestion.findByIdAndUpdate(suggestionId, data, {new: true});

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

// DELETE SUGGESTION
exports.deleteSuggestion = async (req, res, next) => {
    try {
        // CHECK IF SUGGESTION IS EXIST OR NOT
        const suggestionId = req.params.suggestionId;
        let suggestion = await Suggestion.findById(suggestionId);
        if(!suggestion){
            const error = new Error(global.ERROR_NOT_FOUND.MESSAGE);
            error.statusCode = global.ERROR_NOT_FOUND.CODE;
            throw error;
        }

        // CHECK THE OWNERSHIP
        if(suggestion.suggestedBy.toString() !== req.userId){
            const error = new Error(global.ERROR_UNAUTHORIZED.MESSAGE);
            error.statusCode = global.ERROR_UNAUTHORIZED.CODE;
            throw error;
        }

        // REMOVE THE SUGGESTION
        suggestion = await Suggestion.findByIdAndRemove(suggestionId);

        // RETURN JSON RESPONSE
        res.status(global.SUCCESS_GENERAL.CODE).json({
            message: global.SUCCESS_GENERAL.MESSAGE,
            data: suggestion
        });
    } catch(error){
        // IF ERROR, GO TO THE NEXT ERROR HANDLER MIDDLEWARE
        error.statusCode = error.statusCode || global.ERROR_SERVER_GENERAL.CODE;
        error.message = error.message || global.ERROR_SERVER_GENERAL.MESSAGE;
        next(error);
    }
}

// RESPONSE SUGGESTION
exports.responseSuggestion = async (req, res, next) => {
    try {
        let data = {};

        // CHECK IF SUGGESTION IS EXIST OR NOT
        const suggestionId = req.params.suggestionId;
        const suggestion = await Suggestion.findById(suggestionId);
        if(!suggestion){
            const error = new Error(global.ERROR_NOT_FOUND.MESSAGE);
            error.statusCode = global.ERROR_NOT_FOUND.CODE;
            throw error;
        }

        // GET DATA FROM REQUEST'S BODY
        const status = req.body.status;

        // EDIT DATA
        suggestion.status = status;

        // SAVE NEW DATA
        const result = await suggestion.save();

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

// UPVOTE SUGGESTION
exports.upvoteSuggestion = async (req, res, next) => {
    try {
        let data = {};

        // CHECK IF SUGGESTION IS EXIST OR NOT
        const suggestionId = req.params.suggestionId;
        const suggestion = await Suggestion.findById(suggestionId);
        if(!suggestion){
            const error = new Error(global.ERROR_NOT_FOUND.MESSAGE);
            error.statusCode = global.ERROR_NOT_FOUND.CODE;
            throw error;
        }

        // PUSH OR PULL DATA
        if(!suggestion.upVotedBy.includes(req.userId)){
            suggestion.upVotedBy.push(req.userId);
        } else {
            suggestion.upVotedBy.pull(req.userId);
        }

        // SAVE NEW DATA
        const result = await suggestion.save();

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