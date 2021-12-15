const router = require('express').Router();
const Admin = require('../../models/Admin');
const User = require('../../models/User');
const {
    adminRegistrationValidation,
    loginValidation,
    adminAccess
} = require('../../utility/validation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Transaction = require('../../models/Transaction');
const generateRandomNumber = require('../../utility/generateRandomNumber');
const { getTransactionObject } = require('../../utility/transactionObjectBuilder');

module.exports = async (req, res) => {
    if (req.admin.admin) {
        try {
            // fetches the admin and transaction from the database
            // const admin = await Admin.findOne({ _id: req.admin._id });
            const transactions = await Transaction.find({})
            let transaction = transactions.filter(transaction => {
                return +transaction.transactionId !== +req.transactionId
            })[0]

            console.log(transaction)
            const transactionArray = transaction.credits.concat(...transaction.debits)
            const transactionObj = transactionArray.find(transaction => +transaction.id === +req.params.transactionID)

            // extract the sender and receiver object
            let senderObj = transactionObj.sender;
            let receiverObj = transactionObj.receiver;
            let amount = +transactionObj.amount;

            // get sender and receiver model
            const values = await Promise.all([
                User.findOne({ account: senderObj.account.toString() }),
                User.findOne({ account: receiverObj.account.toString() })
            ])
            console.log(values)

            const sender = values[0];
            const receiver = values[1];
            const transactionDate = Date.now()

            // get debit and credit transaction model and store in the database
            const creditTransaction = getTransactionObject(sender, amount, receiver, 'CREDIT', transactionDate);
            const debitTransaction = getTransactionObject(receiver, amount, sender, 'DEBIT', transactionDate);
            console.log("fine")

            // reversing the transaction
            await Promise.all([
                transaction.updateOne({ $push: { debits: debitTransaction } }),
                transaction.updateOne({ $push: { credits: creditTransaction } }),
                sender.updateOne({ balance: +sender.balance + +amount }),
                receiver.updateOne({ balance: +receiver.balance - +amount }),
                sender.updateOne({ $push: { credit: creditTransaction } }),
                receiver.updateOne({ $push: { debit: debitTransaction } })
            ])

            res.status(200).send(`The transaction with transactionID: ${req.params.transactionID} has been reversed`)
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        return res.status(400).json('You\'re not an Admin')
    }
}