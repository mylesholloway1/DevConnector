const express = require('express');
const router = express.Router();
const passport = require('passport');
const { check, validationResult } = require('express-validator');
const config = require('config');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route  GET /:username
// @dsec   get all user profiles
// @access public
router.get('/:username', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      username: req.params.username,
    }).populate('user', ['username', 'avatar']);

    if (!profile) {
      return res.status(400).send('user does not exist');
    }

    return res.status(200).json(profile);
  } catch (err) {
    console.log(err.message);
    return res.status(500).json('server error');
  }
});

module.exports = router;
