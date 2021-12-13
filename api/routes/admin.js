const router = require('express').Router();
const Admin = require('../models/Admin');
const User = require('../models/User');
const {
    adminRegistrationValidation,
    loginValidation,
    adminAccess
} = require('../utility/validation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Transaction = require('../models/Transaction');
const generateRandomNumber = require('../utility/generateRandomNumber')

// login as an Admin
router.post('/', async (req, res) => {
    try {

        const { error } = loginValidation(req.body);
        if (error) {
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
        const token = jwt.sign({ _id: admin._id, 
            admin: true,
            transaction: admin.transactionId
        }, 
            process.env.AUTH_TOKEN_SECRET);
        res.header('authentication-token', token).send(token);
    } catch (err) {
        res.status(500).json(err);
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

    // generate transactionId, check whether it alrady exist and add to model
    let transactionId = generateRandomNumber(20)
    const transactionExist = await Transaction.findOne({ transactionId: transactionId })
    while (transactionExist) {
        transactionId = generateRandomNumber(20)
        transactionExist = await Transaction.findOne({ transactionId: transactionId })
    }

    // create new transaction and admin model
    const transactionModel = new Transaction({
        transactionId: transactionId
    })

    const admin = new Admin({
        ...req.body,
        password: hashedPassword,
        transactionId: transactionId
    })

    try {
        //saving the newly created Admin and Transaction Model
        await transactionModel.save();
        const savedAdmin = await admin.save();
        console.log('hello')
        res.status(200).json(savedAdmin)
    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
});

// fetch list of all registered users
router.get('/users', adminAccess, async (req, res) => {
    if (req.admin.admin) {
        try {
            // Get the admin from the database
            const admin = await Admin.findOne({ _id: req.admin._id });
            console.log(admin.accounts)

            // fetch list of registered users
            const users = await Promise.all(
                admin.accounts.map(account => {
                    return User.find({ account: account.toString() })
                })
            )

            return res.status(200).json(users)
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        return res.status(400).json('You\'re not an Admin')
    }
})

// deletes a specified user
router.delete('/delete/:userAccount', adminAccess, async (req, res) => {
    if (req.admin.admin) {
        try {
            // fetches the admin from the database
            const admin = await Admin.findOne({ _id: req.admin._id });

            // Delete user and remove from list of accounts
            const user = await User.findOneAndDelete({ account: req.params.userAccount })

            // remove the user account from the database
            admin.accounts.includes(Number(req.params.userAccount))
                && await admin.updateOne({
                    $pull: {
                        accounts
                            : Number(req.params.userAccount)
                    }
                })

            admin.disabledAccounts.includes(Number(req.params.userAccount))
                && await admin.updateOne({
                    $pull: {
                        disabledAccounts
                            : Number(req.params.userAccount)
                    }
                })
            res.status(200).send(`User ${req.params.userAccount} has been deleted`);
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        return res.status(400).json('You\'re not an Admin')
    }
})

// reverse transaction
router.post('/reverse-transaction/:transactionID', adminAccess, async (req, res) => {
    if (req.admin.admin) {
        try {
            // fetches the admin from the database
            const admin = await Admin.findOne({ _id: req.admin._id });

            // Get transaction details from Transaction Model
            const transaction = await Transaction.findOne({ transactionId: admin.transactionId });
            const transactionArray = transaction.credits.concat(...transaction.debits)
            const transactionObj = transactionArray.filter(transaction => transaction.id === req.params.transactionID)

            // extract the sender and receiver object
            let senderObj = null
            let receiverObj = null
            let amount = null
            if( typeof transactionObj === 'object'){
                senderObj = transactionObj.sender;
                receiverObj = transactionObj.receiver;
                amount = transactionObj.amount
            } else {
                senderObj = transactionObj[0].sender;
                receiverObj = transactionObj[0].receiver;
                amount = transactionObj[0].amount
            }

            // get sender and receiver model
            const values = await Promise.all([
                User.findOne({ account: senderObj.account.toString() }),
                User.findOne({ account: receiverObj.account.toString() })
            ])

            const sender = values[0];
            const receiver = values[1];
            const transactionId = Date.now()

            // get debit and credit transaction model and store in the database
            const creditTransaction = getTransactionObject(sender, amount, receiver, 'CREDIT', transactionId);
            const debitTransaction = getTransactionObject(receiver, amount, sender, 'DEBIT', transactionId);

            // reversing the transaction
            await Promise.all([
                transaction.updateOne({ $push: { debits: debitTransaction } }),
                transaction.updateOne({ $push: { credits: creditTransaction } }),
                sender.updateOne({ balance: sender.balance + amount }),
                receiver.updateOne({ balance: receiver.balance - amount }),
                sender.updateOne({ $push: { credit: creditTransaction } }),
                receiver.updateOne({ $push: { debit: debitTransaction } })
            ])

        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        return res.status(400).json('You\'re not an Admin')
    }
})

// disables a user account
router.put('/deactivate-account/:userAccount', adminAccess, async (req, res) => {
    if (req.admin.admin) {
        try {
            // fetches the admin and user from the database
            const admin = await Admin.findOne({ _id: req.admin._id });
            const user = !admin.disabledAccounts.includes(req.params.userAccount) &&
                await User.findOne({ account: req.params.userAccount });

            // deactivates user
            await user.updateOne({ isAccountDisabled: true })
            await admin.updateOne({
                $push: {
                    disabledAccounts
                        : req.params.userAccount
                }
            })

            res.status(200).json(`The account ${req.params.userAccount} has been disabled`)
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        return res.status(400).json('You\'re not an Admin')
    }
})

// reactivate disabled user account
router.put('/reactivate-account/:userAccount', adminAccess, async (req, res) => {
    if (req.admin.admin) {
        try {
            // fetches the admin and user from the database
            const admin = await Admin.findOne({ _id: req.admin._id });
            const user = admin.disabledAccounts.includes(req.params.userAccount) &&
                await User.findOne({ account: req.params.userAccount });

            // reactivates user
            await user.updateOne({ isAccountDisabled: false })
            await admin.updateOne({
                $pull: {
                    disabledAccounts
                        : req.params.userAccount
                }
            })

            res.status(200).json(`The account ${req.params.userAccount} has been reactivated`)
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        return res.status(400).json('You\'re not an Admin')
    }
})

module.exports = router

/**
 * can add users <This function is to be solved at the auth register route> --- DONE
 * can get all users --- DONE
 * can delete user --- DONE
 * reverse transaction(transfer)
 * Disable User's account --- DONE
 */