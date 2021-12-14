const Admin = require('../../models/Admin');
const Transaction = require('../../models/Transaction');

module.exports = async (req, res) => {
    if (req.admin.admin) {
        try {
            // get the logged in admin
            const admin = await Admin.findOne({ _id: req.admin._id });
            // console.log(admin)
            console.log(admin.transactionId)
            const transaction = await Transaction.findOne({ transactionId: admin.transactionId })
            // const transaction = await Transaction.findOne({ _id: '61b59e1a371ebf4a268f6119' })
            console.log(transaction)
            // get list of all user transactions
            let transactions = {
                credits: transaction.credits,
                debits: transaction.debits
            }

            res.status(200).json(transactions)
        } catch (err) {
            res.status(500).send(err)
        }
    } else {
        res.status(400).send('You\'re not an authenticated user')
    }
}