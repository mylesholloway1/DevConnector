const express = require('express');
const router = express.Router();

// @Route  /api/profile 
// @Desc   profile endpoint
// @Access Public
router.get('/', async (req,res) => {
    res.send('profile endpoint is hitting');
});

module.exports = router;