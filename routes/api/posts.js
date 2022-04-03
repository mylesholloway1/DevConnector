const express = require('express');
const router = express.Router();

// @Route  /api/posts 
// @Desc   posts endpoint
// @Access Public
router.get('/', async (req,res) => {
    res.send('posts endpoint is hitting');
});

module.exports = router;