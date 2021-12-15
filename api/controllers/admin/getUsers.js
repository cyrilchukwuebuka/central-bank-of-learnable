const Admin = require('../../models/Admin');
const User = require('../../models/User');

module.exports = async (req, res) => {
    if (req.admin.admin) {
        try {
            // Get the admin from the database
            const admin = await Admin.findOne({ _id: req.admin._id });

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
}