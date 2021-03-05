// IMPORT APP MODULE
const global = require('../global');
const Technology = require('../models/technology');

// VALIDATE POST PRO CON
exports.validatePostProCon = async (req, res, next) => {
    try {
        let errors = [];

        // GET DATA
        const techId = req.params.techId;
        const tech = await Technology.findById(techId);
        if(!tech){
            // CHECK IF THE TECH IS EXIST
            const error = new Error("Tech does not exist");
            error.statusCode = global.ERROR_VALIDATION.CODE;
            throw error;
        }

        // VALIDATE ACTION
        const action = req.body.action;
        console.log(action);
        console.log([global.ACTION_NEW_PRO, global.ACTION_NEW_CON].includes(action))
        if(!action){
            errors.push({
                field: 'action',
                message: 'Field action cannot be empty'
            })
        } else if(![global.ACTION_NEW_PRO, global.ACTION_NEW_CON].includes(action)){
            errors.push({
                field: 'action',
                message: 'Field action must be either '
                    + global.ACTION_NEW_PRO.toString() + ' or '
                    + global.ACTION_NEW_CON.toString()
            })
        }

        // VALIDATE CONTENT
        const content = req.body.content;
        if(!content || content === ''){
            // CHECK IF CONTENT IS EMPTY
            errors.push({
                field: 'content',
                message: 'Field content cannot be empty'
            })
        } else if(action && action === global.ACTION_NEW_PRO){
            // VALIDATE IF PRO CONTENT ALREADY EXIST OR NOT
            if(tech.pros && Array.isArray(tech.pros) && tech.pros.length > 0){
                // CHECK IF CONTENT IS ALREADY EXIST IN THE TECHNOLOGY
                tech.pros.every(pro => {
                    if(pro.content.toLowerCase() === content.toLowerCase()){
                        errors.push({
                            field: 'content',
                            message: 'Content is already exist in this technology'
                        })
                        return false;
                    }
                    return true;
                })
            }
        } else if(action && action === global.ACTION_NEW_CON){
            // VALIDATE IF CON CONTENT ALREADY EXIST OR NOT
            if(tech.cons && Array.isArray(tech.cons) && tech.cons.length > 0){
                tech.cons.every(con => {
                    if(con.content.toLowerCase() === content.toLowerCase()){
                        errors.push({
                            field: 'content',
                            message: 'Content is already exist in this technology'
                        })
                        return false;
                    }
                    return true;
                })
            }
        }

        // IF ANY VALIDATION ERROR, THROW THE ERROR
        if(errors.length > 0){
            const error = new Error(global.ERROR_VALIDATION.MESSAGE);
            error.statusCode = global.ERROR_VALIDATION.CODE;
            error.data = errors;
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

// VALIDATE PUT PRO CON
exports.validatePutProCon = async (req, res, next) => {
    try {
        let errors = [];

        // GET DATA
        const techId = req.params.techId;
        const tech = await Technology.findById(techId);
        if(!tech){
            const error = new Error("Tech does not exist");
            error.statusCode = global.ERROR_VALIDATION.CODE;
            throw error;
        }

        // VALIDATE ACTION
        const action = req.body.action;
        if(!action){
            // CHECK IF ACTION IS EMPTY
            errors.push({
                field: 'action',
                message: 'Field action cannot be empty'
            })
        } else if(![global.ACTION_UPVOTE_PRO, global.ACTION_UPVOTE_CON].includes(action)){
            // CHECK IF ACTION IS INVALID
            errors.push({
                field: 'action',
                message: 'Field action must be either '
                    + global.ACTION_UPVOTE_PRO.toString() + ' or '
                    + global.ACTION_UPVOTE_CON.toString()
            })
        }

        // VALIDATE CONTENT
        const content = req.body.content;
        let isContained = false;
        if(!content || content === ''){
            errors.push({
                field: 'content',
                message: 'Field content cannot be empty'
            })
        } else if(action && action === global.ACTION_UPVOTE_PRO){
            // VALIDATE IF PRO CONTENT ALREADY EXIST OR NOT
            if(tech.pros && Array.isArray(tech.pros) && tech.pros.length > 0){
                tech.pros.every(pro => {
                    if(pro.content.toLowerCase() === content.toLowerCase()){
                        isContained = true;
                        return false;
                    }
                    return true;
                })
            }
        } else if(action && action === global.ACTION_UPVOTE_CON){
            // VALIDATE IF CON CONTENT ALREADY EXIST OR NOT
            if(tech.cons && Array.isArray(tech.cons) && tech.cons.length > 0){
                tech.cons.every(cons => {
                    if(cons.content.toLowerCase() === content.toLowerCase()){
                        isContained = true;
                        return false;
                    }
                    return true;
                })
            }
        }

        // CHECK IF CONTENT IS ALREADY EXIST OR NOT
        if(!isContained){
            errors.push({
                field: 'content',
                message: 'Content does not exist in this technology'
            })
        }

        // IF ANY VALIDATION ERROR, THROW THE ERROR
        if(errors.length > 0){
            const error = new Error(global.ERROR_VALIDATION.MESSAGE);
            error.statusCode = global.ERROR_VALIDATION.CODE;
            error.data = errors;
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