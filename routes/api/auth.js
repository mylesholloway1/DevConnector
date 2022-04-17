const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const {check, validationResult} = require('express-validator');
const config = require('config');
const jwt = require('jsonwebtoken');
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

// @route  POST /api/users
// @desc   Authenticate user
// @access Public
router.post('/',[
    //email must be valid and is required
    check('email', 'email is required').not().notEmpty(),
    //password is required
    check('password', 'password is required').not().notEmpty()
],async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    const {email,password}=req.body

    try{
        //check if user exists
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({errors:[{msg:'Email or password are invalid'}]});
        }

        //check if password is valid
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({errors:[{msg:'Email or password are invalid'}]});
        }
        
        const payload = {
            user:{
                id: user.id
            }
        }

        jwt.sign(
            payload,
            config.get('jwtSecret'),
            {expiresIn:60},
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