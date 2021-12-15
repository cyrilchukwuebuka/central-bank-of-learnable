const Admin = require('../../models/Admin');
const User = require('../../models/User');

module.exports = async (req, res) => {
    if (req.admin.admin) {
        try {
            // fetches the admin and user from the database
            const admin = await Admin.findOne({ _id: req.admin._id });
            const user = admin.disabledAccounts.includes(Number(req.params.userAccount)) &&
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
}