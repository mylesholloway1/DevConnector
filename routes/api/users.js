const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

const User = require('../../models/User');

// @route  POST api/users
// @desc   Register User
// @access Public
router.post('/', [
    //name field cannot be empty
    check('name', 'name is required').not().notEmpty(),
    //email must be valid email
    check('email', 'Pleas provide a valid email').isEmail(),
    //password must be 6 characters or more
    check('password', 'Password must be 6 characters or more').isLength({min:6})
],  async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const { name, email, password } = req.body;

    try {
        //see if the user exists
        let user = await User.findOne({email});
        if(user){
            return res.status(400).json({errors:[{msg:'User already exists'}]})
        }

        //get the users gravatar
        const avatar = gravatar.url({
            s:'200',
            r:'pg',
            d:'mm'
        });

        user = new User({
            name,
            email,
            avatar,
            password
        });

        //encrypt the password
        const salt = await bcrypt.genSalt(10);

        user.password = await bcrypt.hash(password, salt);

        await user.save();

        //return jsonwebtoken
        res.send('user registered');
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }

});

module.exports = router;