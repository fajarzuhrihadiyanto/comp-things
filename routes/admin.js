// IMPORT NODE EXPRESS PACKAGE
const express = require('express');

// IMPORT APP PACKAGE
const adminValidation = require('../middlewares/data-admin-validation');
const adminController = require('../controllers/admin');
const isAdmin = require('../middlewares/is-admin');

// DEFINE THE ROUTER
const router = express.Router();

// GET ADMINS
router.get('/admins', isAdmin, adminController.getAdmins);

// GET ADMIN
router.get('/admin/:adminId', isAdmin, adminController.getAdmin);

// POST ADMIN
router.post('/admin', isAdmin, adminValidation.validatePostAdmin, adminController.postAdmin);

// PUT ADMIN
router.put('/admin', isAdmin, adminValidation.validatePutAdmin, adminController.putAdmin);

// DELETE ADMIN
router.delete('/admin/:adminId', isAdmin, adminController.deleteAdmin);

// EXPORT THE ROUTER
module.exports = router;