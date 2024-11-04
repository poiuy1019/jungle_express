const express = require('express');
const router = express.Router();
const postsController = require('../../controllers/postsController');
const verifyJWT = require('../../config/verifyJWT');

router.route('/all')
    .get(postsController.getAllPosts);
router.route('/')
    .post(verifyJWT, postsController.createNewPost)
    .put(verifyJWT, postsController.updatePost)
    .delete(verifyJWT, postsController.deletePost);

router.route('/:username')
    .get(postsController.getPost);

module.exports = router;
