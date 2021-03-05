// IMPORT NODE EXPRESS PACKAGE
const express = require('express');

// IMPORT APP PACKAGE
const authValidation = require('../middlewares/data-auth-validation');
const adminAuthController = require('../controllers/admin-auth');
const isAdmin = require('../middlewares/is-admin');

// DEFINE THE ROUTER
const router = express.Router();

// SIGN-IN
router.post('/sign-in', authValidation.validateSignIn, adminAuthController.signInAdmin);

// CHANGE PASSWORD ADMIN
router.put('/admin-password', isAdmin, authValidation.validateChangePassword, adminAuthController.changePasswordAdmin);

// EXPORT THE ROUTER
module.exports = router;