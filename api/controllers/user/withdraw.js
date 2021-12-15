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
        
        // get the current signed in user and decrease the amount
        try {
            const validUser = await User.findOne({ _id: req.user._id });
            
            // check if user's account is active
            if (validUser.isAccountDisabled) {
                return res.status(400).send('The User\'s account is deactivated')
            }

            // update user's account balance
            if (validUser.balance === Infinity) {
                return res.status(400).send(`You do not have funds in your account`);
            } else {
                let currentBalance = Number(validUser.balance) - +amount
                await validUser.updateOne({ balance: currentBalance })
            }

            // get debit transaction model and store in the database
            const debitTransaction = getTransactionObject(validUser, +amount, validUser, 'DEBIT', Date.now());
            const transaction = await Transaction.findOne({ 'transactionId': req.transactionId })
            await transaction.updateOne({
                $push: {
                    debits: debitTransaction
                }
            })

            await validUser.updateOne({ $push: { debit: debitTransaction } })
            res.status(200).send(`${amount} withrawn sucessfully`)
        } catch (err) {
            res.status(500).send(err)
        }
    } else {
        res.status(400).send('You\'re not an authenticated user')
    }
}