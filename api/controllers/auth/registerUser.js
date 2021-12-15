const router = require('express').Router();
const User = require('../../models/User');
const {
    userRegistrationValidation,
    loginValidation,
    adminAccess
} = require('../../utility/validation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../../models/Admin');
const generateRandomNumber = require('../../utility/generateRandomNumber');

module.exports = async (req, res) => {
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

        while (admin.accounts.includes(userAccount)) {
            userAccount = generateRandomNumber()
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(req.body.password, salt);

        const user = new User({
            ...req.body,
            password: hashedPassword,
            account: userAccount,
            transactionId: admin.transactionId
        })

        try {
            //saving the newly created user and adding the account to admin list of accounts
            const savedUser = await user.save();
            await admin.updateOne({ $push: { accounts: userAccount } })
            res.status(200).json(savedUser)
        } catch (err) {
            console.log(err);
            res.status(400).json(err)
        }
    } else {
        return res.status(400).json('You\'re not an Admin')
    }
}