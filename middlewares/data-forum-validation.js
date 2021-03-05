// IMPORT APP PACKAGE
const global = require('../global');
const Technology = require('../models/technology');

const asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

// VALIDATE FORUM (BOTH POST AND PUT)
exports.validateForum = async (req, res, next) => {
    try {
        let errors = [];

        // VALIDATE CONTENT
        const content = req.body.content;
        if(!content || content === ''){
            // CHECK IF CONTENT IS EMPTY
            errors.push({
                field: 'content',
                message: 'Field content cannot be empty'
            })
        } else if (content.length < 20 || content.length > 4096){
            // CHECK IF CONTENT IS INVALID LENGTH
            errors.push({
                field: 'content',
                message: 'Content length must be between 20 and 4096'
            })
        }

        // VALIDATE TAGS
        const tags = req.body.tags;
        if(!tags || !Array.isArray(tags) || tags.length === 0){
            errors.push({
                field: 'tags',
                message: 'Tags must be non empty array'
            });
        } else {
            let tagErrors = [];

            await asyncForEach(tags, async tag => {
                const tech = await Technology.findById(tag);
                if (!tech) {
                    tagErrors.push('Tag ' + tag + ' is not valid');
                }
            })

            if(tagErrors.length > 0){
                errors.push({
                    field: 'tags',
                    message: 'Look at the data',
                    data: tagErrors
                })
            }
        }

        // IF ANY VALIDATION ERROR, THROW THE ERROR
        if (errors.length > 0) {
            const error = new Error(global.ERROR_VALIDATION.MESSAGE);
            error.statusCode = global.ERROR_VALIDATION.CODE;
            error.data = errors;
            throw error
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

// ? IS THIS NECESSARY ?, REMEMBER THE NEW PATH JUST FOR UPVOTE FORUM
// VALIDATE UPVOTE FORUM (PUT)
exports.validateUpvoteForum = (req, res, next) => {
    try {
        let errors = [];

        // ? SHOULD ACTION FIELD EXIST ?
        // VALIDATE ACTION
        const action = req.body.action;
        if(!action || action != global.ACTION_UPVOTE_FORUM){
            errors.push({
                field: 'action',
                message: 'Field action is invalid'
            })
        }

        // IF ANY VALIDATION ERROR, THROW THE ERROR
        if (errors.length > 0) {
            const error = new Error(global.ERROR_VALIDATION.MESSAGE);
            error.statusCode = global.ERROR_VALIDATION.CODE;
            error.data = errors;
            throw error
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