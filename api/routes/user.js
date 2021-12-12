const router = require('express').Router();
const User = require('../models/User');
const { userAccess } = require('../utility/validation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Transaction = require('../models/Transaction');
const { getCreditTransactionModel, getDebitTransactionModel } = require('../utility/transactionModelBuilder');

// user deposit route which bears an amount query param
router.post('/deposit', userAccess, async (req, res) => {
    if (req.user.user) {
        // check for the amount being a valid number
        let amount = req.query.amount;
        if (isNAN(amount)) {
            return res.status(400).send('Enter a valid deposit amount')
        }

        // get the current signed in user and increase the amount
        try {
            const validUser = await User.findOne({ _id: req.user._id });

            // check if user's account is active
            if (validUser.isAccountDisabled) {
                return res.status(400).send('The User\'s account is deactivated')
            }

            // update user's account balance
            await validUser.updateOne({ balance: validUser.balance + Number(amount) })

            // get credit transaction model and store in the database
            const creditTransaction = getCreditTransactionModel(validUser, Number(amount), validUser);
            await Transaction.findOneAndUpdate(
                { _id: req.transaction._id },
                {$push : {
                    credits : creditTransaction
                }}
            )
            await validUser.updateOne({ $push: { credit: creditTransaction } })
            res.status(200).send('Amount deposited sucessfully')
        } catch (err) {
            res.status(500).send(err)
        }
    } else {
        res.status(400).send('You\'re not an authenticated user')
    }
})

// user withdraw route
router.post('/withdraw', userAccess, async (req, res) => {
    if (req.user.user) {
        // check for the amount being a valid number
        let amount = req.query.amount;
        if (isNAN(amount)) {
            return res.status(400).send('Enter a valid deposit amount')
        }

        // get the current signed in user and decrease the amount
        try {
            const validUser = await User.findOne({ _id: req.user._id });

            // check if user's account is active
            if (validUser.isAccountDisabled) {
                return res.status(400).send('The User\'s account is deactivated')
            }

            // update user's account balance
            await validUser.updateOne({ balance: validUser.balance - Number(amount) })

            // get debit transaction model and store in the database
            const debitTransaction = getDebitTransactionModel(validUser, Number(amount), validUser);
            await Transaction.findOneAndUpdate(
                { _id: req.transaction._id },
                {
                    $push: {
                        debits: debitTransaction
                    }
                }
            )
            await validUser.updateOne({ $push: { debit: debitTransaction } })
            res.status(200).send('Amount withrawn sucessfully')
        } catch (err) {
            res.status(500).send(err)
        }
    } else {
        res.status(400).send('You\'re not an authenticated user')
    }
})

// user transfer route
router.post('/transfer', userAccess, async (req, res) => {
    if (req.user.user) {
        let senderAcc = Number(req.query.sender)
        let receiverAcc = Number(req.query.receiver)

        // check for the amount being a valid number
        let amount = req.query.amount;
        if (isNAN(amount)) {
            return res.status(400).send('Enter a valid deposit amount')
        }

    } else {
        res.status(400).send('You\'re not an authenticated user')
    }
})

// user list of transactions route
router.get('/transactions', userAccess, async (req, res) => {
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