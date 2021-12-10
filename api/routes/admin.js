const router = require('express').Router();
const Admin = require('../models/Admin');
const {
    adminRegistrationValidation,
    loginValidation
} = require('../utility/validation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// login as an Admin
router.post('/', async (req, res) => {
    try{

        const { error } = loginValidation(req.body);
        if(error){
            return res.status(400).json(error.details[0].message)
        }
    
        // Check admin existence in the database
        const admin = await Admin.findOne({ email: req.body.email })
        if (!admin) {
            return res.status(400).json('Sorry email is not with our Admin records');
        }
    
        // Compare password for accuracy
        const validPassword = await bcrypt.compare(req.body.password, admin.password);
        if (!validPassword) {
            return res.status(400).json('Sorry password is invalid');
        }

        // creating and assigning token
        const token = jwt.sign({ _id: admin._id }, process.env.AUTH_TOKEN_SECRET);
        res.header('authentication-token', token).json(token)
    } catch(err) {
        console.log(err)
    }
})

// register as an Admin
router.post('/register', async (req, res) => {
    const { error } = adminRegistrationValidation(req.body)
    if (error) {
        return res.status(400).json(error.details[0].message);
    }

    // check for existence in the MongoDb database
    const emailExists = await Admin.findOne({ email: req.body.email });
    if (emailExists) {
        return res.status(400).json('Email already in the Admin database');
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    const admin = new Admin({
        ...req.body,
        password: hashedPassword
    })

    try {
        //saving the newly created admin
        const savedAdmin = await admin.save();
        res.status(200).json(savedAdmin)
    } catch (err) {
        console.log(err);
        res.status(400).json(err)
    }
})

module.exports = router

/**
 * can add users <This function is to be solved at the auth register route>
 * can get all users
 * can delete user
 * reverse transaction(transfer)
 * Disable User's account
 */