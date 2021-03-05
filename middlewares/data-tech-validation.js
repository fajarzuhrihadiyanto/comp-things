// IMPORT APP MODULE
const global = require('../global');
const Type = require('../models/type');

// VALIDATE TECH (BOTH POST AND PUT)
exports.validateTech = async (req, res, next) => {
    try {
        let errors = [];

        // VALIDATE TYPE
        let type;
        const typeId = req.body.typeId;
        if(!typeId || typeId === ''){
            // CHECK IF TYPE IS EMPTY
            errors.push({
                field: 'type',
                message: 'Type cannot be empty'
            })
        } else {
            // CHECK IF TYPE DOES NOT EXIST
            type = await Type.findById(typeId);
            if(!type){
                errors.push({
                    field: 'type',
                    message: 'Type does not exist'
                })
            }
        }

        // VALIDATE BASED ON TYPE
        if(type && Array.isArray(type.fields) && type.fields.length > 0){
            type.fields.forEach(field => {
                // CHECK IF THE FIELD IS REQUIRED BY THE TYPE
                if(field.isRequired && !req.body[field.fieldName]){
                    errors.push({
                        field: field.fieldName,
                        message: 'Field ' + field.fieldName + ' cannot be empty'
                    })
                }

                // CHECK ANOTHER CONSTRAIN BY THE TYPE
                if(req.body[field.fieldName] && field.constrains && Array.isArray(field.constrains) && field.constrains.length > 0){
                    field.constrains.forEach(constrain => {

                        // CHECK MIN CONSTRAIN IF ANY
                        if(constrain.name === 'min'){
                            if(parseFloat(req.body[field.fieldName]) < constrain.value){
                                errors.push({
                                    field: field.fieldName,
                                    message: 'Field ' + field.fieldName + ' must be greater than or equal to ' + constrain.value
                                })
                            }
                        }
                        // CHECK MAX CONSTRAIN IF ANY
                        else if(constrain.name === 'max'){
                            if(parseFloat(req.body[field.fieldName]) > constrain.value){
                                errors.push({
                                    field: field.fieldName,
                                    message: 'Field ' + field.fieldName + ' must be lower than or equal to ' + constrain.value
                                })
                            }
                        }
                        // CHECK MINLENGTH CONSTRAIN IF ANY
                        else if(constrain.name === 'minLength'){
                            if(req.body[field.fieldName].length < constrain.value){
                                errors.push({
                                    field: field.fieldName,
                                    message: 'Length of field ' + field.fieldName + ' must be greater than or equal to ' + constrain.value
                                })
                            }
                        }
                        // CHECK MAXLENGTH CONSTRAIN IF ANY
                        else if(constrain.name === 'maxLength'){
                            if(req.body[field.fieldName].length > constrain.value){
                                errors.push({
                                    field: field.fieldName,
                                    message: 'Length of field ' + field.fieldName + ' must be lower than or equal to ' + constrain.value
                                })
                            }
                        }
                        // CHECK EQUAL CONSTRAIN IF ANY
                        else if(constrain.name === 'equal'){
                            if(req.body[field.fieldName] !== constrain.value){
                                errors.push({
                                    field: field.fieldName,
                                    message: 'Field ' + field.fieldName + ' must be equal to ' + constrain.value
                                })
                            }
                        }
                        // CHECK NOTEQUAL CONSTRAIN IF ANY
                        else if(constrain.name === 'notEqual'){
                            if(req.body[field.fieldName] === constrain.value){
                                errors.push({
                                    field: field.fieldName,
                                    message: 'Field ' + field.fieldName + ' must not be equal to ' + constrain.value
                                })
                            }
                        }
                        // CHECK REGEX CONSTRAIN IF ANY
                        else if(constrain.name === 'regex'){
                            const regex = new RegExp(constrain.value);
                            if(!regex.test(req.body[field.fieldName])){
                                errors.push({
                                    field: field.fieldName,
                                    message: 'Field ' + field.fieldName + ' must be match with ' + constrain.value
                                })
                            }
                        }
                    })
                }
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