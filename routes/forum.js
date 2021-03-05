// IMPORT NODE EXPRESS PACKAGE
const express = require('express');

// IMPORT APP PACKAGE
const forumValidation = require('../middlewares/data-forum-validation');
const forumController = require('../controllers/forum');
const commentValidation = require('../middlewares/data-comment-validation');
const commentController = require('../controllers/comment');
const isAdmin = require('../middlewares/is-admin');
const isAuth = require('../middlewares/is-auth');

// DEFINE THE ROUTER
const router = express.Router();

// GET FORUMS
router.get('/forums', forumController.getForums);

// GET FORUM
router.get('/forum/:forumId', forumController.getForum);

// POST FORUM
router.post('/forum', isAuth, forumValidation.validateForum, forumController.postForum);

// PUT FORUM
router.put('/forum/:forumId', isAuth, forumValidation.validateForum, forumController.putForum);

// DELETE FORUM
router.delete('/forum/:forumId', isAdmin, forumController.deleteForum);

// PUT UPVOTE FORUM
router.put('/upvote-forum/:forumId', isAuth, forumController.upvoteForum);

// GET PARENT COMMENT
router.get('/parent-comments/:forumId', commentController.getParentComments);

// GET CHILD COMMENT
router.get('/child-comments/:parentId', commentController.getChildComment);

// GET COMMENT
router.get('/comment/:commentId', commentController.getComment);

// POST COMMENT
router.post('/comment', isAuth, commentValidation.validateComment, commentController.postComment);

// PUT COMMENT
router.put('/comment/:commentId', isAuth, commentValidation.validateComment, commentController.putComment);

// DELETE COMMENT
router.delete('/comment/:commentId', isAuth, commentController.deleteComment);

// PUT UPVOTE COMMENT
router.put('/upvote-comment/:commentId', isAuth, commentController.upvoteComment);

// EXPORT THE ROUTER
module.exports = router;