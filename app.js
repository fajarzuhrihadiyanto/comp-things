// IMPORT NODE EXPRESS PACKAGE
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');

// IMPORT APP PACKAGE
const adminRoute = require('./routes/admin');
const adminAuthRoute = require('./routes/admin-auth');
const entityRoute = require('./routes/entity');
const forumRoute = require('./routes/forum');
const masterRoute = require('./routes/master');
const userRoute = require('./routes/user');
const userAuthRoute = require('./routes/user-auth');
const corsMiddleware = require('./middlewares/cors');
const errorHandlerMiddleware = require('./middlewares/error-handler');

// DEFINE EXPRESS APP
const app = express();

// DOTENV
const dotenv = require('dotenv');
dotenv.config();

// CONFIGURE FILE STORAGE
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
    }
});

// CONFIGURE FILE FILTER
const fileFilter = (req, file, cb) => {
    if(['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype)){
        cb(null, true);
    } else {
        const error = new Error("File Type Error: must be one of png, jpg, jpeg");
        error.statusCode = 422;
        cb(error);
    }
}

// OTHER MIDDLEWARE
app.use(bodyParser.json());
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).array('images'));
app.use('/public', express.static(path.join(__dirname, 'public')));

// CROSS-ORIGIN RESOURCE SHARING MIDDLEWARE
app.use(corsMiddleware);

// MAIN ROUTE
app.use('/user-auth', userAuthRoute);
app.use('/user', userRoute);
app.use('/admin-auth', adminAuthRoute);
app.use('/admin', adminRoute);
app.use('/master', masterRoute);
app.use('/entity', entityRoute);
app.use('/forum', forumRoute);

// ERROR HANDLER MIDDLEWARE
app.use(errorHandlerMiddleware);

// DEFINE DATABASE CONNECTION
const databaseName = process.env.DATABASE_NAME;
const databaseHost = process.env.DATABASE_HOST;
const databaseUser = process.env.DATABASE_USER;
const databasePassword = process.env.DATABASE_PASSWORD;

mongoose.connect(
    'mongodb+srv://'
    + databaseUser + ':'
    + databasePassword + '@'
    + databaseHost + '/'
    + databaseName + '?retryWrites=true&w=majority'
).then(result => {
    // LISTEN TO PORT 8080 WHEN SUCCEED
    app.listen(8080);
})
