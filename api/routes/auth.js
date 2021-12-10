const router = require('express').Router();
const User = require('../models/User');
const {
    userRegistrationValidation,
    loginValidation,
    adminAccess
} = require('../utility/validation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// user login route
router.post('/login', async (req, res) => {
    try{
        const { error } = loginValidation(req.body);
        if (error) {
            return res.status(400).json(error.details[0].message);
        }
    
        // Check user existence in the database
        const user = await User.findOne({email: req.body.email})
        if(!user){
            return res.status(400).json('Sorry email is not with our user records');
        }
    
        // Compare password for accuracy
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if(!validPassword){
            return res.status(400).json('Sorry password is invalid');
        }
    
        // creating and assigning token
        const token = jwt.sign({_id: user._id}, process.env.AUTH_TOKEN_SECRET);
        res.header('authentication-token', token).json(token)
    } catch(err){
        console.log(err)
    }
})

// user registration route
router.post('/register', async (req, res) => {
    // console.log(req.admin)
    const { error } = userRegistrationValidation(req.body)
    if (error) {
        return res.status(400).json(error.details[0].message);
    }

    // check for existence in the MongoDb database
    const emailExists = await User.findOne({email: req.body.email});
    if (emailExists) {
        return res.status(400).json('Email already in the User database');
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    const user = new User({
        ...req.body,
        password: hashedPassword
    })
    
    try {
        //saving the newly created user
        const savedUser = await user.save();
        res.status(200).json(savedUser)
    } catch (err) {
        console.log(err);
        res.status(400).json(err)
    }
})

module.exports = router;
