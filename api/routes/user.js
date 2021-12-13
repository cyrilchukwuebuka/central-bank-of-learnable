const router = require('express').Router();
const User = require('../models/User');
const { userAccess } = require('../utility/validation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Transaction = require('../models/Transaction');
const generateRandomNumber = require('../utility/generateRandomNumber')
const { getTransactionObject } = require('../utility/transactionObjectBuilder');

// user deposit route which bears an amount query param
router.post('/deposit', userAccess, async (req, res) => {
    if (req.user.user) {
        // check for the amount being a valid number
        let amount = req.query.amount;
        if (isNaN(amount)) {
            return res.status(400).send('Enter a valid deposit amount')
        }
        console.log('Hello')
        // get the current signed in user and increase the amount
        try {
            const validUser = await User.findOne({ _id: req.user._id });

            // check if user's account is active
            if (validUser.isAccountDisabled) {
                return res.status(400).send('The User\'s account is deactivated')
            }

            console.log(validUser.balance)
            // update user's account balance
            if (validUser.balance === Infinity) {
                await validUser.updateOne({ balance: +amount })
            } else {
                let currentBalance = Number(validUser.balance) + +amount
                await validUser.updateOne({ balance: currentBalance })
            }

            // get credit transaction model and store in the database
            const creditTransaction = getTransactionObject(validUser, +amount, validUser, 'CREDIT', Date.now());
            const transaction = await Transaction.findOne({ 'transactionId': req.transactionId })
            await transaction.updateOne({
                $push: {
                    credits: creditTransaction
                }
            })

            await validUser.updateOne({ $push: { credit: creditTransaction } })
            res.status(200).send(`${amount} deposited sucessfully`)
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
        let amount = Number(req.query.amount);
        if (isNaN(amount)) {
            return res.status(400).send('Enter a valid withdrawal amount')
        }
        console.log('Hello')
        // get the current signed in user and decrease the amount
        try {
            const validUser = await User.findOne({ _id: req.user._id });
            console.log(1)
            // check if user's account is active
            if (validUser.isAccountDisabled) {
                return res.status(400).send('The User\'s account is deactivated')
            }
            console.log(2)
            // update user's account balance
            if (validUser.balance === Infinity) {
                return res.status(400).send(`You do not have funds in your account`);
            } else {
                let currentBalance = Number(validUser.balance) - +amount
                await validUser.updateOne({ balance: currentBalance })
            }
            console.log(3)
            // get debit transaction model and store in the database
            const debitTransaction = getTransactionObject(validUser, +amount, validUser, 'DEBIT', Date.now());
            console.log(4)
            const transaction = await Transaction.findOne({ 'transactionId': req.transactionId })
            await transaction.updateOne({
                $push: {
                    debits: debitTransaction
                }
            })

            await validUser.updateOne({ $push: { debit: debitTransaction } })
            console.log(5)
            res.status(200).send(`${amount} withrawn sucessfully`)
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
        let receiverAcc = Number(req.query.receiver)

        // check for the amount being a valid number
        let amount = Number(req.query.amount);
        if (isNaN(amount)) {
            return res.status(400).send('Enter a valid transfer amount')
        }

        // get the current signed in user and initiate transfer
        try {
            const sender = await User.findOne({ _id: req.user._id });

            // fetch the receiver detail from the database
            const receiver = await User.findOne({ account: receiverAcc });
            if (!receiver) {
                return res.status(400).send('The receiver account number is invalid')
            }

            // check if user's account is active
            if (sender.isAccountDisabled) {
                return res.status(400).send('The User\'s account is deactivated')
            }

            // update sender and receiver account balance
            await Promise.all([sender.updateOne({ balance: sender.balance - Number(amount) }),
            receiver.updateOne({ balance: receiver.balance + Number(amount) })])

            const transactionId = Date.now()

            // get debit and credit transaction model and store in the database
            const debitTransaction = getTransactionObject(sender, amount, receiver, 'DEBIT', transactionId);
            const creditTransaction = getTransactionObject(sender, amount, receiver, 'CREDIT', transactionId);
            const transaction = await Transaction.findOne({ transactionId: req.transaction._id });

            await Promise.all([
                transaction.updateOne({ $push: { debits: debitTransaction } }),
                transaction.updateOne({ $push: { credits: creditTransaction } }),
                sender.updateOne({ $push: { debit: debitTransaction } }),
                receiver.updateOne({ $push: { credit: creditTransaction } })
            ])

            res.status(200).send(`${amount} transfered sucessfully`)
        } catch (err) {
            res.status(500).send(err)
        }

    } else {
        res.status(400).send('You\'re not an authenticated user')
    }
})

// user list of transactions route
router.get('/transactions', userAccess, async (req, res) => {
    if (req.user.user) {
        try {
            // get the logged in user
            const validUser = await User.findOne({ _id: req.user._id });

            // check if user's account is active
            if (validUser.isAccountDisabled) {
                return res.status(400).send('The User\'s account is deactivated')
            }

            // get list of all user transactions
            let transactions = {
                credits: validUser.credit,
                debits: validUser.debit
            }

            res.status(200).json(transactions)
        } catch (err) {
            res.status(500).send(err)
        }
    } else {
        res.status(400).send('You\'re not an authenticated user')
    }
})

module.exports = router

/**
 * Deposit money --- DONE
 * Withdraw money --- DONE
 * Transfer funds to other users ---
 * See a list of their transactions ---
 */