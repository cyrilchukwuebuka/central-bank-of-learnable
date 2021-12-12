const router = require('express').Router();
const User = require('../models/User');
const {
    userRegistrationValidation,
    loginValidation,
    adminAccess
} = require('../utility/validation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const generateRandomNumber = require('../utility/generateRandomNumber');

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
        const token = jwt.sign({_id: user._id, user: true}, process.env.AUTH_TOKEN_SECRET);
        res.header('authentication-token', token).send(token);
    } catch(err){
        console.log(err)
    }
})

// user registration route
router.post('/register', adminAccess, async (req, res) => {
    if (req.admin.admin) {
        const { error } = userRegistrationValidation(req.body)
        if (error) {
            return res.status(400).json(error.details[0].message);
        }
    
        // check for existence User and Admin in the MongoDb database
        let admin = null;
        let userExists = null;
        
        await Promise.all([Admin.findOne({ _id: req.admin._id }), User.findOne({ email: req.body.email })])
        .then(values => {
            admin = values[0];
            userExists = values[1];
        })

        if (userExists) {
            return res.status(400).json('Email already in the User database');
        }

        let userAccount = generateRandomNumber()

        while (admin.accounts.includes(userAccount)){
            userAccount = generateRandomNumber()
        }
    
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt);
    
        const user = new User({
            ...req.body,
            password: hashedPassword,
            account: userAccount
        })
        
        try {
            //saving the newly created user and adding the account to admin list of accounts
            const savedUser = await user.save();
            const savedAdmin = await admin.updateOne({ $push: { accounts: userAccount } })
            res.status(200).json({savedAdmin, savedUser})
        } catch (err) {
            console.log(err);
            res.status(400).json(err)
        }
    } else {
        return res.status(400).json('You\'re not an Admin')
    }
})

module.exports = router;
