const express = require('express');
const router = express.Router();
const commentsController = require('../../controllers/commentsController');
const verifyJWT = require('../../config/verifyJWT');

router.route('/all')
    .get(commentsController.getAllComments);
router.route('/')
    .post(verifyJWT,commentsController.createNewComment)
    .put(verifyJWT,commentsController.updateComment)
    .delete(verifyJWT,commentsController.deleteComment);

module.exports = router;
