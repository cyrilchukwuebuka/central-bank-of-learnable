const User = require('../../models/User');
const Transaction = require('../../models/Transaction');
const { getTransactionObject } = require('../../utility/transactionObjectBuilder');

module.exports = async (req, res) => {
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

            // check if user's account is active
            if (sender.isAccountDisabled) {
                return res.status(400).send('The User\'s account is deactivated')
            }

            // fetch the receiver detail from the database
            const receiver = await User.findOne({ account: receiverAcc });

            if (!receiver) {
                return res.status(400).send('The receiver account number is invalid')
            }

            // update sender and receiver account balance
            if (sender.balance === Infinity) {
                return res.status(400).send(`You do not have funds in your account`);
            }

            if (receiver.balance === Infinity) {
                await Promise.all([sender.updateOne({ balance: +sender.balance - +amount }),
                receiver.updateOne({ balance: +amount })])
            } else {
                await Promise.all([sender.updateOne({ balance: +sender.balance - +amount }),
                receiver.updateOne({ balance: +receiver.balance + +amount })])
            }

            const transactionId = Date.now()

            // get debit and credit transaction model and store in the database
            const debitTransaction = getTransactionObject(sender, amount, receiver, 'DEBIT', transactionId);
            const creditTransaction = getTransactionObject(sender, amount, receiver, 'CREDIT', transactionId);

            const transaction = await Transaction.findOne({ 'transactionId': req.transactionId })

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
}