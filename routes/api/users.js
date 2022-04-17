const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const config = require('config');
const jwt = require('jsonwebtoken');

const User = require('../../models/User');

// @route  POST /api/users
// @desc   test users
// @access Public
router.post('/',[
    //name cannot be empty
    check('name','name is required').not().notEmpty(),
    //email must be valid
    check('email', 'email must be valid').isEmail(),
    //password must be at least 6 char
    check('password', 'password must be at least 6 characters long').isLength({min:6})
],async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    const {name,email,password}=req.body

    try{
        //check if user exists
        let user = await User.findOne({email});
        if(user){
            return res.status(400).json({errors:[{msg:'user already exists'}]});
        }

        const avatar = gravatar.url(email, {
            s:'200',
            r:'pg',
            d:'mm'
        })

        user = new User({
            name,
            email,
            avatar,
            password
        });

        //encrypt password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password,salt);

        await user.save();
        
        const payload = {
            user:{
                id: user.id
            }
        }

        jwt.sign(
            payload,
            config.get('jwtSecret'),
            {expiresIn:'1d'},
            (err,token) => {
                if (err) throw err;
                return res.status(200).json({token:'Bearer '+token})
            }
        );


    }catch(err){
        console.error(err.message);
        return res.status(500).send('Server error');
    }
    
});

module.exports = router;