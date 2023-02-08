const express = require('express');

const PostController = require('../controllers/post-controller');

const router = express.Router();

router.get('/', PostController.index);
router.get('/admin', PostController.getAdmin);
router.get('/posts/:id/edit', PostController.getSinglePost);

router.post('/posts', PostController.createPost);
router.post('/posts/:id/edit', PostController.updatePost);
router.post('/posts/:id/delete', PostController.deletePost);

module.exports = router;
