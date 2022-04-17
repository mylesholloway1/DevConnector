const express = require('express');
const router = express.Router();
const passport = require('passport');

const User = require('../../models/User');

// @route  GET /api/auth
// @desc   get authorized user information
// @access Private
router.get('/', passport.authenticate('jwt', {session:false}), async (req,res)=>{
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).send('server error');
    }
});

module.exports = router;