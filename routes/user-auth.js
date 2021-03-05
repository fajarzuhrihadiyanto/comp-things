// IMPORT NODE EXPRESS PACKAGE
const express = require('express');

// IMPORT APP PACKAGE
const authValidation = require('../middlewares/data-auth-validation');
const authController = require('../controllers/auth');
const isAuth = require('../middlewares/is-auth');

// DEFINE THE ROUTER
const router = express.Router();

// SIGN-UP
router.put('/sign-up', authValidation.validateSignUp, authController.signUp);

// SIGN-IN
router.post('/sign-in', authValidation.validateSignIn, authController.signIn);

// FORGOT PASSWORD
router.post('/forgot-password', authValidation.validateForgotPassword, authController.forgotPassword);

// RESET PASSWORD
router.post('/password', authValidation.validateResetPassword, authController.resetPassword);

// CHANGE PASSWORD
router.put('/password', isAuth, authValidation.validateChangePassword, authController.changePassword);

// EXPORT THE ROUTER
module.exports = router;