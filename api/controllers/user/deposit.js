const User = require('../../models/User');
const Transaction = require('../../models/Transaction');
const { getTransactionObject } = require('../../utility/transactionObjectBuilder');

module.exports = async (req, res) => {
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
}