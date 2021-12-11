const router = require('express').Router();
const User = require('../models/User');
const { userAccess } = require('../utility/validation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// user deposit route which bears an amount query param
router.post('/deposit', userAccess, async (req, res) => {
    if (req.user.user) {
        // check for the amount being a valid number
        let amount = req.query.amount;
        if(isNAN(amount)){
            return res.status(400).send('Enter a valid deposit amount')
        }

        // get the current signed in user and inrcrease the amount
        try {
            const validUser = await User.findOne({_id: req.user._id});
            await validUser.updateOne({})
        } catch (err) {
            res.status(500).send(err)
        }
    } else {
        res.status(400).send('You\'re not an authenticated user')
    }
})
// user withdraw route
router.get('/withdraw', userAccess, async (req, res) => {
    if (req.user) {
        c
    } else {
        res.status(400).send('You\'re not an authenticated user')
    }
})
// user transfer route
router.post('/transfer', userAccess, async (req, res) => {
    if (req.user) {
        c
    } else {
        res.status(400).send('You\'re not an authenticated user')
    }
})
// user list of transactions route
router.post('/transactions', userAccess, async (req, res) => {
    if (req.user) {
        c
    } else {
        res.status(400).send('You\'re not an authenticated user')
    }
})

module.exports = router

/**
 * Deposit money
 * Withdraw money
 * Transfer funds to other users
 * See a list of their transactions
 */