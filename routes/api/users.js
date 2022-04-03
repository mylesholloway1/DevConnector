const express = require('express');
const router = express.Router();

// @Route  /api/users 
// @Desc   users endpoint
// @Access Public
router.get('/', async (req,res) => {
    res.send('api endpoint is hitting');
});

module.exports = router;