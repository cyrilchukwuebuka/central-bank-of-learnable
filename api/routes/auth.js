const router = require('express').Router();
const User = require('../models/User');
const {
    userRegistrationValidation,
    userLoginValidation
} = require('../utility/validation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
    try{
        const { error } = userLoginValidation(req.body);
        if (error) {
            return res.status(400).json(error.details[0].message);
        }
    
        // Check user existence in the database
        const user = await User.findOne({email: req.body.email})
        if(!user){
            return res.status(400).json('Sorry email is not with our records');
        }
    
        // Compare password for accuracy
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if(!validPassword){
            return res.status(400).json('Sorry password is invalid');
        }
    
        // creating and assigning token
        const token = jwt.sign({id: user._id}, process.env.AUTH_TOKEN_SECRET);
        res.header('authentication-token', token).json(token)
        // console.log(req['authentication-token'])
    } catch(err){
        console.log(err)
    }
})

module.exports = router;

/**
 * login route
 * register route
 */