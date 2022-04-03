const express = require('express');
const router = express.Router();

// @Route  /api/auth 
// @Desc   auth endpoint
// @Access Public
router.get('/', async (req,res) => {
    res.send('auth endpoint is hitting');
});

module.exports = router;