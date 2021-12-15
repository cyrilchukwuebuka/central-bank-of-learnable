const User = require('../../models/User');

module.exports = async (req, res) => {
    if (req.user.user) {
        try {
            // get the logged in user
            const validUser = await User.findOne({ _id: '61b69c7fe78867d2c8416e2a' });
            console.log(validUser)
            // check if user's account is active
            if (validUser.isAccountDisabled) {
                return res.status(400).send('The User\'s account is deactivated')
            }

            // get list of all user transactions
            let transactions = {
                credits: validUser.credit,
                debits: validUser.debit
            }

            console.log(transactions)
            res.status(200).json(transactions)
        } catch (err) {
            res.status(500).send(err)
        }
    } else {
        res.status(400).send('You\'re not an authenticated user')
    }
}