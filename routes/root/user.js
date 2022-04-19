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
    //check if user still exists
    const user = await User.findOne({
      username: req.params.username,
    });
    if (!user) {
      return res.status(400).send('user does not exist');
    }

    //using user, check if profile exists
    const profile = await Profile.findOne({
      user: user._id,
    });
    if (!profile) {
      return res.status(400).send('user does not exist');
    }

    //display profiles
    return res.status(200).json(profile);
  } catch (err) {
    console.log(err.message);
    return res.status(500).json('server error');
  }
});

module.exports = router;
