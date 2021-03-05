// IMPORT APP PACKAGES
const global = require('../global');
const Comment = require('../models/comment');
const queryUtil = require('../utils/query-util');

// GET PARENT COMMENTS
exports.getParentComments = async (req, res, next) => {
    try {
        const forumId = req.params.forumId;

        // GET THE DATA
        const result = await queryUtil.getDatas('Comment', {forumId: forumId, parentId: null}, req);

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

// GET CHILD COMMENTS
exports.getChildComment = async (req, res, next) => {
    try {
        const parentId = req.params.parentId;

        // GET THE DATA
        const result = await queryUtil.getDatas('Comment', {parentId: parentId}, req);

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

// GET COMMENT
exports.getComment = async (req, res, next) => {
    try {
        // CHECK IF COMMENT IS EXIST OR NOT
        const commentId = req.params.commentId;
        const comment = await Comment.findById(commentId);
        if(!comment){
            const error = new Error(global.ERROR_NOT_FOUND.MESSAGE);
            error.statusCode = global.ERROR_NOT_FOUND.CODE;
            throw error;
        }

        // RETURN JSON RESPONSE
        res.status(global.SUCCESS_GENERAL.CODE).json({
            message: global.SUCCESS_GENERAL.MESSAGE,
            data: comment
        })
    } catch(error){
        // IF ERROR, GO TO THE NEXT ERROR HANDLER MIDDLEWARE
        error.statusCode = error.statusCode || global.ERROR_SERVER_GENERAL.CODE;
        error.message = error.message || global.ERROR_SERVER_GENERAL.MESSAGE;
        next(error);
    }
}

// POST COMMENT
exports.postComment = async (req, res, next) => {
    try {
        // GET DATA FROM REQUEST'S BODY
        const content = req.body.content;
        const forumId = req.body.forumId;
        const parentId = req.body.parentId;

        // DEFAULT DATA
        const commentBy = req.userId;
        const upVotedBy = [];

        // CREATE NEW DATA
        const comment = await new Comment({
            commentBy: commentBy,
            forumId: forumId,
            parentId: parentId,
            content: content,
            upVotedBy: upVotedBy
        }).save();

        // RETURN JSON RESPONSE
        res.status(global.SUCCESS_POST.CODE).json({
            message: global.SUCCESS_POST.MESSAGE,
            data: comment
        })
    } catch(error){
        // IF ERROR, GO TO THE NEXT ERROR HANDLER MIDDLEWARE
        error.statusCode = error.statusCode || global.ERROR_SERVER_GENERAL.CODE;
        error.message = error.message || global.ERROR_SERVER_GENERAL.MESSAGE;
        next(error);
    }
}

// PUT COMMENT
exports.putComment = async (req, res, next) => {
    try {
        // CHECK IF COMMENT IS EXIST OR NOT
        const commentId = req.params.commentId;
        const comment = await Comment.findById(commentId);
        if(!comment){
            const error = new Error(global.ERROR_NOT_FOUND.MESSAGE);
            error.statusCode = global.ERROR_NOT_FOUND.CODE;
            throw error;
        }

        // CHECK THE OWNERSHIP
        if(comment.commentBy.toString() !== req.userId){
            const error = new Error(global.ERROR_UNAUTHORIZED.MESSAGE);
            error.statusCode = global.ERROR_UNAUTHORIZED.CODE;
            throw error;
        }

        // GET DATA FROM REQUEST'S BODY
        const content = req.body.content;

        // EDIT DATA
        comment.content = content;

        // SAVE NEW DATA
        const result = await comment.save();

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

// DELETE COMMENT
exports.deleteComment = async (req, res, next) => {
    try {
        // CHECK IF COMMENT IS EXIST OR NOT
        const commentId = req.params.commentId;
        let comment = await Comment.findById(commentId);
        if(!comment){
            const error = new Error(global.ERROR_NOT_FOUND.MESSAGE);
            error.statusCode = global.ERROR_NOT_FOUND.CODE;
            throw error
        }

        // CHECK THE OWNERSHIP
        if(comment.commentBy.toString() !== req.userId){
            const error = new Error(global.ERROR_UNAUTHORIZED.MESSAGE);
            error.statusCode = global.ERROR_UNAUTHORIZED.CODE;
            throw error
        }

        comment = await Comment.findByIdAndRemove(commentId);

        // RETURN JSON RESPONSE
        res.status(global.SUCCESS_GENERAL.CODE).json({
            message: global.SUCCESS_GENERAL.MESSAGE,
            data: comment
        });
    } catch(error){
        // IF ERROR, GO TO THE NEXT ERROR HANDLER MIDDLEWARE
        error.statusCode = error.statusCode || global.ERROR_SERVER_GENERAL.CODE;
        error.message = error.message || global.ERROR_SERVER_GENERAL.MESSAGE;
        next(error);
    }
}

// UPVOTE COMMENT
exports.upvoteComment = async (req, res, next) => {
    try {
        // CHECK IF COMMENT IS EXIST OR NOT
        const commentId = req.params.commentId;
        const comment = await Comment.findById(commentId);
        if(!comment){
            const error = new Error(global.ERROR_NOT_FOUND.MESSAGE);
            error.statusCode = global.ERROR_NOT_FOUND.CODE;
            throw error;
        }

        // PUSH OR PULL DATA
        if(!comment.upVotedBy.includes(req.userId)){
            comment.upVotedBy.push(req.userId);
        } else {
            comment.upVotedBy.pull(req.userId);
        }

        // SAVE NEW DATA
        const result = await comment.save();

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