const express = require('express');
const router = express.Router();

// @route  GET /api/users
// @desc   test users
// @access Public
router.get('/',(req,res)=>res.send('this is the user endpoint'));

module.exports = router;