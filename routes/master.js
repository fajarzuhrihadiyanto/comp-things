// IMPORT NODE EXPRESS PACKAGE
const express = require('express');

// IMPORT APP PACKAGE
const masterValidation = require('../middlewares/data-master-validation');
const masterController = require('../controllers/master');
const isAdmin = require('../middlewares/is-admin');

// DEFINE THE ROUTER
const router = express.Router();

// GET TYPES
router.get('/types', masterController.getTypes);

// GET TYPE
router.get('/type/:typeId', masterController.getType);

// POST TYPE
router.post('/type', isAdmin, masterValidation.validateType, masterController.postType);

// PUT TYPE
router.put('/type/:typeId', isAdmin, masterValidation.validateType, masterController.putType);

// DELETE TYPE
router.delete('/type/:typeId', isAdmin, masterController.deleteType);

// EXPORT THE ROUTER
module.exports = router;