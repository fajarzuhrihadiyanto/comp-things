// IMPORT APP PACKAGES
const global = require('../global');
const Forum = require('../models/forum');
const queryUtil = require('../utils/query-util');

// GET FORUMS
exports.getForums = async (req, res, next) => {
    try {
        // GET THE DATA
        const result = await queryUtil.getDatas('Forum', {}, req);

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

// GET FORUM
exports.getForum = async (req, res, next) => {
    try {
        // CHECK IF FORUM IS EXIST OR NOT
        const forumId = req.params.forumId;
        const forum = await Forum.findById(forumId)
        if(!forum){
            const error = new Error(global.ERROR_NOT_FOUND.MESSAGE);
            error.statusCode = global.ERROR_NOT_FOUND.CODE;
            throw error;
        }

        // RETURN JSON RESPONSE
        res.status(global.SUCCESS_GENERAL.CODE).json({
            message: global.SUCCESS_GENERAL.MESSAGE,
            data: forum
        })
    } catch(error){
        // IF ERROR, GO TO THE NEXT ERROR HANDLER MIDDLEWARE
        error.statusCode = error.statusCode || global.ERROR_SERVER_GENERAL.CODE;
        error.message = error.message || global.ERROR_SERVER_GENERAL.MESSAGE;
        next(error);
    }
}

// POST FORUM
exports.postForum = async (req, res, next) => {
    try {
        // GET DATA FROM REQUEST'S BODY
        const content = req.body.content;
        const tags = req.body.tags;

        // DEFAULT DATA
        const initiatedBy = req.userId;
        const upVotedBy = [];

        // CREATE NEW FORUM
        const forum = await new Forum({
            initiatedBy: initiatedBy,
            content: content,
            tags: tags,
            upVotedBy: upVotedBy
        }).save();

        // RETURN JSON RESPONSE
        res.status(global.SUCCESS_POST.CODE).json({
            message: global.SUCCESS_POST.MESSAGE,
            data: forum
        })
    } catch(error){
        // IF ERROR, GO TO THE NEXT ERROR HANDLER MIDDLEWARE
        error.statusCode = error.statusCode || global.ERROR_SERVER_GENERAL.CODE;
        error.message = error.message || global.ERROR_SERVER_GENERAL.MESSAGE;
        next(error);
    }
}

// PUT FORUM
exports.putForum = async (req, res, next) => {
    try {
        // CHECK IF FORUM IS EXIST OR NOT
        const forumId = req.params.forumId;
        const forum = await Forum.findById(forumId)
        if(!forum){
            const error = new Error(global.ERROR_NOT_FOUND.MESSAGE);
            error.statusCode = global.ERROR_NOT_FOUND.CODE;
            throw error;
        }

        // CHECK THE OWNERSHIP
        if(forum.initiatedBy.toString() !== req.userId){
            const error = new Error(global.ERROR_UNAUTHORIZED.MESSAGE);
            error.statusCode = global.ERROR_UNAUTHORIZED.CODE;
            throw error;
        }

        // GET DATA FROM REQUEST'S BODY
        const content = req.body.content;
        const tags = req.body.tags;

        // EDIT DATA
        forum.content = content;
        forum.tags = tags;

        // SAVE NEW DATA
        const result = await forum.save();

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

// DELETE FORUM
exports.deleteForum = async (req, res, next) => {
    try {
        // CHECK IF FORUM IS EXIST OR NOT
        const forumId = req.params.forumId;
        let forum = await Forum.findById(forumId);
        if(!forum){
            const error = new Error(global.ERROR_NOT_FOUND.MESSAGE);
            error.statusCode = global.ERROR_NOT_FOUND.CODE;
            throw error;
        }

        // DELETE FORUM BY ID
        forum = await Forum.findByIdAndRemove(forumId);

        // RETURN JSON RESPONSE
        res.status(global.SUCCESS_GENERAL.CODE).json({
            message: global.SUCCESS_GENERAL.MESSAGE,
            data: forum
        })
    } catch(error){
        // IF ERROR, GO TO THE NEXT ERROR HANDLER MIDDLEWARE
        error.statusCode = error.statusCode || global.ERROR_SERVER_GENERAL.CODE;
        error.message = error.message || global.ERROR_SERVER_GENERAL.MESSAGE;
        next(error);
    }
}

// UPVOTE FORUM
exports.upvoteForum = async (req, res, next) => {
    try {
        // CHECK IF FORUM IS EXIST OR NOT
        const forumId = req.params.forumId;
        const forum = await Forum.findById(forumId)
        if(!forum){
            const error = new Error(global.ERROR_NOT_FOUND.MESSAGE);
            error.statusCode = global.ERROR_NOT_FOUND.CODE;
            throw error;
        }

        // PUSH OR PULL DATA
        if(!forum.upVotedBy.includes(req.userId)){
            forum.upVotedBy.push(req.userId);
        } else {
            forum.upVotedBy.pull(req.userId);
        }

        // SAVE NEW DATA
        const result = await forum.save();

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
