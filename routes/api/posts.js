const express = require('express');
const router = express.Router();
const passport = require('passport');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');
const Post = require('../../models/Post');

// @route  POST /api/posts
// @desc   Create a post
// @access Private
router.post(
  '/',
  [
    passport.authenticate('jwt', { session: false }),
    [check('text', 'Please enter some text').notEmpty().isLength({ max: 200 })],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { text } = req.body;

    const PostFields = {};
    PostFields.user = req.user.id;
    PostFields.text = text;
    PostFields.username = req.user.username;
    PostFields.avatar = req.user.avatar;

    try {
      let post = new Post(PostFields);
      await post.save();
      return res.status(200).json(post);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('server error');
    }
  }
);

// @route  GET /api/posts
// @desc   GET all posts
// @access Private
router.get(
  '/',
  [passport.authenticate('jwt', { session: false })],
  async (req, res) => {
    try {
      const post = await Post.find().sort({ date: -1 });
      return res.status(200).json(post);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('server error');
    }
  }
);

// @route  GET /api/posts/:id
// @desc   GET post by id
// @access Private
router.get(
  '/:id',
  [passport.authenticate('jwt', { session: false })],
  async (req, res) => {
    try {
      const post = await Post.findById({ _id: req.params.id });
      if (!post) {
        return res.status(404).send('Post not found');
      }

      return res.status(200).json(post);
    } catch (err) {
      if (err.kind === 'ObjectId') {
        return res.status(404).send('Post not found');
      }
      console.log(err.message);
      res.status(500).send('server error');
    }
  }
);

// @route  DELETE /api/posts/:id
// @desc   DELETE Post by id
// @access Private
router.delete(
  '/:id',
  [passport.authenticate('jwt', { session: false })],
  async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (post.user.toString() !== req.user.id) {
        return res.status(401).send('User not authorized');
      }
      await post.remove();

      return res.status(200).send('post removed');
    } catch (err) {
      if (err.kind === 'ObjectId') {
        return res.status(404).send('Post not found');
      }
      console.log(err.message);
      res.status(500).send('server error');
    }
  }
);

// @route  PUT /api/posts/like:id
// @desc   like Post by id
// @access Private
router.put(
  '/like/:id',
  [passport.authenticate('jwt', { session: false })],
  async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      //check if this user already liked the post
      if (
        post.likes.filter(like => like.user.toString() == req.user.id).length >
        0
      ) {
        return res.status(400).json({ msg: 'post already liked' });
      }
      post.likes.unshift({ user: req.user.id });
      await post.save();
      res.status(200).send(post.likes);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('server error');
    }
  }
);

// @route  PUT /api/posts/unlike:id
// @desc   unlike Post by id
// @access Private
router.put(
  '/unlike/:id',
  [passport.authenticate('jwt', { session: false })],
  async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      //check if this user already liked the post
      if (
        post.likes.filter(like => like.user.toString() === req.user.id)
          .length === 0
      ) {
        return res.status(400).json({ msg: 'post has not been liked' });
      }
      removeIndex = post.likes
        .map(like => like.user.toString())
        .indexOf(req.user.id);

      post.likes.splice(removeIndex, 1);
      await post.save();
      res.status(200).send(post.likes);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('server error');
    }
  }
);

// @route  PUT /api/posts/comment/:id
// @dsec   add user comment to post
// @access private
router.put(
  '/comment/:id',
  [
    passport.authenticate('jwt', { session: false }),
    [check('text', 'Please add some text').notEmpty()],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { text } = req.body;

    const NewCom = {};
    NewCom.user = req.user.id;
    NewCom.text = text;
    NewCom.username = req.user.username;
    NewCom.avatar = req.user.avatar;

    try {
      const post = await Post.findById(req.params.id);
      post.comments.unshift(NewCom);
      await post.save();
      res.status(200).json(post);
    } catch (err) {
      console.log(err.message);
      req.status(500).send('server error');
    }
  }
);

// @route  DELETE /api/posts/comment/:id/:com_id
// @dsec   delete user comment to post
// @access private
router.delete(
  '/comment/:id/:com_id',
  [passport.authenticate('jwt', { session: false })],
  async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);

      const comIndex = post.comments
        .map(item => item.id)
        .indexOf(req.params.com_id);

      if (post.comments[comIndex].user.toString() !== req.user.id) {
        return res.status(401).send('User not authorized');
      }

      post.comments.splice(comIndex, 1);
      await post.save();
      res.status(200).json(post);
    } catch (err) {
      if (err.kind === 'ObjectId') {
        return res.status(404).send('Post not found');
      }
      console.log(err.message);
      req.status(500).send('server error');
    }
  }
);

module.exports = router;
