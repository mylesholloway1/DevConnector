const express = require('express');
const router = express.Router();
const passport = require('passport');
const request = require('request');
const { check, validationResult } = require('express-validator');
const config = require('config');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route  GET /api/profile
// @dsec   get all user profiles
// @access public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', [
      'username',
      'avatar',
    ]);
    return res.status(200).json(profiles);
  } catch (err) {
    console.log(err.message);
    return res.status(500).json('server error');
  }
});

// @route  GET /api/profile/me
// @dsec   Get the profile information for current user
// @access private
router.get(
  '/me',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      const profile = await Profile.findOne({ user: req.user.id }).populate(
        'user',
        ['username', 'avatar']
      );
      if (!profile) {
        return res
          .status(400)
          .json({ msg: 'there is no profile for this user' });
      }

      res.status(200).send(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('server error');
    }
  }
);

// @route  POST /api/profile/me
// @dsec   Create or Update profile information for current user
// @access private
router.post(
  '/me',
  [
    passport.authenticate('jwt', { session: false }),
    [
      check('status', 'status is required').notEmpty(),
      check('skills', 'skills are required').notEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      status,
      skills,
      bio,
      githubusername,
      youtube,
      twitter,
      facebook,
      linkedin,
      instagram,
    } = req.body;

    //build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    profileFields.status = status;
    profileFields.skills = skills.split(',').map(skill => skill.trim());
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (githubusername) profileFields.githubusername = githubusername;

    //build social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        //Update
        profile = await Profile.findByIdAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }

      //Create
      profile = new Profile(profileFields);
      await profile.save();

      return res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('server error');
    }
  }
);

// @route  DELETE /api/profile
// @dsec   delete profile, user and posts for current user
// @access private
router.delete(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      //todo: find and remove posts
      await Profile.findOneAndRemove({ user: req.user.id });

      await User.findOneAndRemove({ _id: req.user.id });

      return res.status(200).send('Profile and User removed');
    } catch (err) {
      console.log(err.message);
      return res.status(500).json('server error');
    }
  }
);

// @route  PUT /api/profile/experience
// @dsec   add user experience to profile
// @access private
router.put(
  '/experience',
  [
    passport.authenticate('jwt', { session: false }),
    [
      check('title', 'Title is required').notEmpty(),
      check('company', 'Company is required').notEmpty(),
      check('location', 'Location is required').notEmpty(),
      check('from', 'from date is required').notEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { title, company, location, from, to, current, description } =
      req.body;

    const NewExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.experience.unshift(NewExp);
      await profile.save();
      res.status(200).json(profile);
    } catch (err) {
      console.log(err.message);
      req.status(500).send('server error');
    }
  }
);

// @route  PUT /api/profile/education
// @dsec   add user eduction to profile
// @access private
router.put(
  '/education',
  [
    passport.authenticate('jwt', { session: false }),
    [
      check('school', 'school is required').notEmpty(),
      check('degree', 'degree is required').notEmpty(),
      check('fieldofstudy', 'fieldofstudy is required').notEmpty(),
      check('from', 'from date is required').notEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { school, degree, fieldofstudy, from, to, current, description } =
      req.body;

    const NewEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });
      profile.education.unshift(NewEdu);
      await profile.save();
      res.status(200).json(profile);
    } catch (err) {
      console.log(err.message);
      req.status(500).send('server error');
    }
  }
);

// @route  PUT /api/profile/experience/:exp_id
// @dsec   update user experience
// @access private
router.put(
  '/experience/:exp_id',
  [
    passport.authenticate('jwt', { session: false }),
    [
      check('title', 'Title is required').notEmpty(),
      check('company', 'Company is required').notEmpty(),
      check('location', 'Location is required').notEmpty(),
      check('from', 'from date is required').notEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, company, location, from, to, current, description } =
      req.body;

    const NewExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (!profile) {
        return req
          .status(400)
          .json({ errors: [{ msg: 'Someting went wrong' }] });
      }

      const expIndex = profile.experience
        .map(item => item.id)
        .indexOf(req.params.exp_id);

      if (expIndex == -1) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Someting went wrong' }] });
      }

      profile.experience[expIndex] = NewExp;
      await profile.save();

      return res.status(200).send(profile);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('server error');
    }
  }
);

// @route  PUT /api/profile/education/:edu_id
// @dsec   update user education
// @access private
router.put(
  '/education/:edu_id',
  [
    passport.authenticate('jwt', { session: false }),
    [
      check('school', 'school is required').notEmpty(),
      check('degree', 'degree is required').notEmpty(),
      check('fieldofstudy', 'fieldofstudy is required').notEmpty(),
      check('from', 'from date is required').notEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { school, degree, fieldofstudy, from, to, current, description } =
      req.body;

    const NewEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };

    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (!profile) {
        return req
          .status(400)
          .json({ errors: [{ msg: 'Someting went wrong' }] });
      }

      const eduIndex = profile.education
        .map(item => item.id)
        .indexOf(req.params.edu_id);

      if (eduIndex == -1) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Someting went wrong' }] });
      }

      profile.education[eduIndex] = NewEdu;
      await profile.save();

      return res.status(200).send(profile);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('server error');
    }
  }
);

// @route  DELETE /api/profile/experience/:exp_id
// @dsec   delete user experience
// @access private
router.delete(
  '/experience/:exp_id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (!profile) {
        return req
          .status(400)
          .json({ errors: [{ msg: 'Someting went wrong' }] });
      }

      const expIndex = profile.experience
        .map(item => item.id)
        .indexOf(req.params.exp_id);

      if (expIndex == -1) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Someting went wrong' }] });
      }

      profile.experience.splice(expIndex, 1);
      await profile.save();

      return res.status(200).send(profile);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('server error');
    }
  }
);

// @route  DELETE /api/profile/education/:edu_id
// @dsec   delete user education
// @access private
router.delete(
  '/education/:edu_id',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (!profile) {
        return req
          .status(400)
          .json({ errors: [{ msg: 'Someting went wrong' }] });
      }

      const eduIndex = profile.education
        .map(item => item.id)
        .indexOf(req.params.edu_id);

      if (eduIndex == -1) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Someting went wrong' }] });
      }

      profile.education.splice(eduIndex, 1);
      await profile.save();

      return res.status(200).send(profile);
    } catch (err) {
      console.log(err.message);
      res.status(500).send('server error');
    }
  }
);

// @route  GET /api/profile/github/:githubusername
// @dsec   get user repositories
// @access private
router.get(
  '/github/:githubusername',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    try {
      const options = {
        uri: `https://api.github.com/users/${
          req.params.githubusername
        }/repos?per_page=5&sort=created:asc&client_id=${config.get(
          'githubClient'
        )}&client_secret=${config.get('githubSecret')}`,
        method: 'GET',
        headers: { 'user-agent': 'node.js' },
      };

      request(options, (err, response, body) => {
        if (err) throw err;
        if (response.statusCode !== 200) {
          res.status(400).json({ msg: 'no github account found' });
        }
        res.json(JSON.parse(body));
      });
    } catch (err) {
      console.log(err.message);
      res.status(500).send('server error');
    }
  }
);

module.exports = router;
