// IMPORT APP PACKAGES
const global = require('../global');
const Technology = require('../models/technology');

// GET PROS
exports.getPros = async (req, res, next) => {
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
            data: tech.pros
        })
    } catch(error){
        // IF ERROR, GO TO THE NEXT ERROR HANDLER MIDDLEWARE
        error.statusCode = error.statusCode || global.ERROR_SERVER_GENERAL.CODE;
        error.message = error.message || global.ERROR_SERVER_GENERAL.MESSAGE;
        next(error);
    }
}

// GET CONS
exports.getCons = async (req, res, next) => {
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
            data: tech.cons
        })
    } catch(error){
        // IF ERROR, GO TO THE NEXT ERROR HANDLER MIDDLEWARE
        error.statusCode = error.statusCode || global.ERROR_SERVER_GENERAL.CODE;
        error.message = error.message || global.ERROR_SERVER_GENERAL.MESSAGE;
        next(error);
    }
}

// POST PRO
exports.postPro = async (req, res, next) => {
    try {
        // GET THE TECH BY ID
        const techId = req.params.techId;
        const tech = await Technology.findById(techId);

        // ADD PRO
        tech.pros.push({
            content: req.body.content,
            upVotedBy: [req.userId]
        })

        // SAVE NEW DATA
        const result = await tech.save();

        // RETURN JSON RESPONSE
        res.status(global.SUCCESS_GENERAL.CODE).json({
            message: global.SUCCESS_GENERAL.MESSAGE,
            data: result.pros
        })
    } catch(error){
        // IF ERROR, GO TO THE NEXT ERROR HANDLER MIDDLEWARE
        error.statusCode = error.statusCode || global.ERROR_SERVER_GENERAL.CODE;
        error.message = error.message || global.ERROR_SERVER_GENERAL.MESSAGE;
        next(error);
    }
}

// POST CON
exports.postCon = async (req, res, next) => {
    try {
        // GET THE TECH BY ID
        const techId = req.params.techId;
        const tech = await Technology.findById(techId);

        // ADD PRO
        tech.cons.push({
            content: req.body.content,
            upVotedBy: [req.userId]
        })

        // SAVE NEW DATA
        const result = await tech.save();

        // RETURN JSON RESPONSE
        res.status(global.SUCCESS_GENERAL.CODE).json({
            message: global.SUCCESS_GENERAL.MESSAGE,
            data: result.cons
        })
    } catch(error){
        // IF ERROR, GO TO THE NEXT ERROR HANDLER MIDDLEWARE
        error.statusCode = error.statusCode || global.ERROR_SERVER_GENERAL.CODE;
        error.message = error.message || global.ERROR_SERVER_GENERAL.MESSAGE;
        next(error);
    }
}

// PUT PRO
exports.putPro = async (req, res, next) => {
    try {
        // GET THE TECH BY ID
        const techId = req.params.techId;
        const tech = await Technology.findById(techId);

        // GET THE PROS
        const pros = tech.pros;

        // PUSH OR PULL DATA
        if(pros.length > 0){
            pros.every(pro => {
                if(pro.content.toLowerCase() === req.body.content.toLowerCase()){
                    if(!pro.upVotedBy.includes(req.userId)){
                        pro.upVotedBy.push(req.userId);
                    } else {
                        pro.upVotedBy.pull(req.userId);
                    }
                    return false;
                }
                return true;
            })
        }

        // SAVE NEW DATA
        const result = await tech.save();

        // RETURN JSON RESPONSE
        res.status(global.SUCCESS_GENERAL.CODE).json({
            message: global.SUCCESS_GENERAL.MESSAGE,
            data: result.pros
        })
    } catch(error){
        // IF ERROR, GO TO THE NEXT ERROR HANDLER MIDDLEWARE
        error.statusCode = error.statusCode || global.ERROR_SERVER_GENERAL.CODE;
        error.message = error.message || global.ERROR_SERVER_GENERAL.MESSAGE;
        next(error);
    }
}

// PUT CON
exports.putCon = async (req, res, next) => {
    try {
        // GET THE TECH BY ID
        const techId = req.params.techId;
        const tech = await Technology.findById(techId);

        // GET THE PROS
        const cons = tech.cons;

        // PUSH OR PULL DATA
        if(cons.length > 0){
            cons.every(con => {
                if(con.content.toLowerCase() === req.body.content.toLowerCase()){
                    if(!con.upVotedBy.includes(req.userId)){
                        con.upVotedBy.push(req.userId);
                    } else {
                        con.upVotedBy.pull(req.userId);
                    }
                    return false;
                }
                return true;
            })
        }

        // SAVE NEW DATA
        const result = await tech.save();

        // RETURN JSON RESPONSE
        res.status(global.SUCCESS_GENERAL.CODE).json({
            message: global.SUCCESS_GENERAL.MESSAGE,
            data: result.cons
        })
    } catch(error){
        // IF ERROR, GO TO THE NEXT ERROR HANDLER MIDDLEWARE
        error.statusCode = error.statusCode || global.ERROR_SERVER_GENERAL.CODE;
        error.message = error.message || global.ERROR_SERVER_GENERAL.MESSAGE;
        next(error);
    }
}

