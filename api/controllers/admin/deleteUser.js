const Admin = require('../../models/Admin');
const User = require('../../models/User');

module.exports = async (req, res) => {
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
}