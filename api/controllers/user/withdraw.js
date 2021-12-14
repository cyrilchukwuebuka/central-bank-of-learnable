const User = require('../../models/User');
const Transaction = require('../../models/Transaction');
const { getTransactionObject } = require('../../utility/transactionObjectBuilder');

module.exports = async (req, res) => {
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
}