const express = require('express');
const router = express.Router();
const passport = require('passport');
const { check, validationResult } = require('express-validator');

const User = require('../../models/User');
const Post = require('../../models/Post');

// @route  POST /api/post
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
      res.status(200).json(post);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('server error');
    }
  }
);

module.exports = router;
