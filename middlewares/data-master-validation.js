// IMPORT APP PACKAGE
const global = require('../global');

// VALIDATE TYPE (BOTH POST AND PUT)
exports.validateType = (req, res, next) => {
    try {
        let errors = [];

        // VALIDATE NAME FIELD
        const name = req.body.name;
        if (!name || name === '') {
            // CHECK IF NAME FIELD IS EMPTY
            errors.push({
                field: "name",
                message: "Field name cannot be empty"
            })
        }

        // VALIDATE FIELDS FIELD
        const fields = req.body.fields;
        // console.log(fields);
        if(!fields || !Array.isArray(fields) || fields.length === 0){
            // CHECK IF FIELDS FIELD IS EMPTY
            errors.push({
                field: "fields",
                message: "Field fields must be non empty array"
            })
        } else {
            let fieldsErrors = [];
            fields.forEach(field => {
                let fieldErrors = [];

                // VALIDATE FIELD NAME EACH FIELD
                if(!field.fieldName || field.fieldName === ''){
                    fieldErrors.push({
                        field: "fieldName",
                        message: "fieldName cannot be empty"
                    })
                }

                // VALIDATE FIELD LABEL EACH FIELD
                if(!field.fieldLabel || field.fieldLabel === ''){
                    fieldErrors.push({
                        field: "fieldLabel",
                        message: "fieldLabel cannot be empty"
                    })
                }

                // VALIDATE FIELD TYPE EACH FIELD
                if(!field.fieldType || field.fieldType === ''){
                    fieldErrors.push({
                        field: "fieldType",
                        message: "fieldType cannot be empty"
                    })
                } else if(!["text", "number", "textarea", "file", "arrayOfFiles", "date"].includes(field.fieldType)){
                    fieldErrors.push({
                        field: "fieldType",
                        message: "fieldType must be one of text, number, textarea, file, arrayOfFiles, date"
                    })
                }

                // VALIDATE FIELD HTML EACH FIELD
                if(!field.fieldHtml || field.fieldHtml === ''){
                    fieldErrors.push({
                        field: "fieldHtml",
                        message: "fieldHtml cannot be empty"
                    })
                }

                // VALIDATE FIELD IS REQUIRED EACH FIELD
                if(field.isRequired === undefined){
                    fieldErrors.push({
                        field: "isRequired",
                        message: "isRequired cannot be empty"
                    })
                }

                // VALIDATE FIELD CONSTRAIN EACH FIELD IF ANY
                if(field.constrains && Array.isArray(field.constrains) && field.constrains.length > 0){
                    let constrainsErrors = []
                    field.constrains.forEach(constrain => {
                        let constrainErrors = [];

                        // VALIDATE CONSTRAIN NAME
                        if(!constrain.name || constrain.name === ''){
                            constrainErrors.push({
                                field: 'name',
                                message: 'Constrain name cannot be empty'
                            })
                        } else if(!["min", "max", "minLength", "maxLength", "equal", "notEqual", "regex"].includes(constrain.name)){
                            constrainErrors.push({
                                field: 'name',
                                message: 'Constrain name is not valid'
                            })
                        }

                        // VALIDATE CONSTRAIN VALUE
                        if(constrain.value === undefined || constrain.value === ''){
                            constrainErrors.push({
                                field: 'value',
                                message: 'Constrain value cannot be empty'
                            })
                        }

                        if(constrainErrors.length > 0){
                            constrainsErrors.push(constrainErrors);
                        }
                    })

                    if(constrainsErrors.length > 0){
                        fieldErrors.push({
                            field: 'constrains',
                            message: 'Look at the data',
                            data: constrainsErrors
                        })
                    }
                }

                if(fieldErrors.length > 0){
                    fieldsErrors.push(fieldErrors);
                }
            })

            if(fieldsErrors.length > 0){
                errors.push({
                    field: "fields",
                    message: "Combination errors on field fields",
                    data: fieldsErrors
                });
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