// IMPORT NODE EXPRESS PACKAGE
const express = require('express');

// IMPORT APP PACKAGE
const techValidation = require('../middlewares/data-tech-validation');
const techController = require('../controllers/tech');
const techProConValidation = require('../middlewares/data-tech-pros-cons-validation');
const techProConController = require('../controllers/tech-pro-con');
const suggestionValidation = require('../middlewares/data-suggestion-validation');
const suggestionController = require('../controllers/suggestion');
const isAdmin = require('../middlewares/is-admin');
const isAuth = require('../middlewares/is-auth');

// DEFINE THE ROUTER
const router = express.Router();

// GET TECHNOLOGIES
router.get('/technologies', techController.getTechnologies);

// GET TECHNOLOGY
router.get('/technology/:techId', techController.getTechnology);

// POST TECHNOLOGY
router.post('/technology', isAdmin, techValidation.validateTech, techController.postTechnology);

// PUT TECHNOLOGY
router.put('/technology/:techId', isAdmin, techValidation.validateTech, techController.putTechnology);

// PUT UPVOTE TECHNOLOGY
router.put('/upvote-technology/:techId', isAuth, techController.upvoteTechnology);

// PUT USE TECHNOLOGY
router.put('/use-technology/:techId', isAuth, techController.useTechnology);

// DELETE TECHNOLOGY
router.delete('/technology/:techId', isAdmin, techController.deleteTechnology);

// GET TECHNOLOGY PROS
router.get('/technology/pros/:techId', techProConController.getPros);

// GET TECHNOLOGY CONS
router.get('/technology/cons/:techId', techProConController.getCons);

// POST TECHNOLOGY PRO
router.post('/technology/pro/:techId', isAuth, techProConValidation.validatePostProCon, techProConController.postPro);

// POST TECHNOLOGY CON
router.post('/technology/con/:techId', isAuth, techProConValidation.validatePostProCon, techProConController.postCon);

// PUT TECHNOLOGY PRO
router.put('/technology/pro/:techId', isAuth, techProConValidation.validatePutProCon, techProConController.putPro);

// PUT TECHNOLOGY CON
router.put('/technology/con/:techId', isAuth, techProConValidation.validatePutProCon, techProConController.putCon);

// GET SUGGESTIONS
router.get('/suggestions', isAuth, suggestionController.getSuggestions);

// GET SUGGESTION
router.get('/suggestion/:suggestionId', isAuth, suggestionController.getSuggestion);

// POST SUGGESTION
router.post('/suggestion', isAuth, techValidation.validateTech, suggestionController.postSuggestion);

// PUT SUGGESTION
router.put('/suggestion/:suggestionId', isAuth, techValidation.validateTech, suggestionController.putSuggestion);

// DELETE SUGGESTION
router.delete('/suggestion/:suggestionId', isAuth, suggestionController.deleteSuggestion);

// PUT RESPONSE SUGGESTION
router.put('/response-suggestion/:suggestionId', isAdmin, suggestionValidation.validateResponseSuggestion, suggestionController.responseSuggestion);

// PUT UPVOTE SUGGESTION
router.put('/upvote-suggestion/:suggestionId', isAuth, suggestionController.upvoteSuggestion);

// EXPORT THE ROUTER
module.exports = router;