const express = require('express');
const router = express.Router();

// @route  POST /api/users
// @desc   test users
// @access Public
router.post('/',(req,res)=>{
    console.log(req.body);
    res.send('this is the user endpoint')
});

module.exports = router;