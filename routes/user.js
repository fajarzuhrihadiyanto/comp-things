// IMPORT NODE EXPRESS PACKAGE
const express = require('express');

// IMPORT APP PACKAGE
const userValidation = require('../middlewares/data-user-validation');
const userController = require('../controllers/user');
const isAuth = require('../middlewares/is-auth');

// DEFINE THE ROUTER
const router = express.Router();

// GET USER
router.get('/user', isAuth, userController.getUser);

// PUT USER
router.put('/user', isAuth, userValidation.validateUpdateUser, userController.putUser);

// EXPORT THE ROUTER
module.exports = router;