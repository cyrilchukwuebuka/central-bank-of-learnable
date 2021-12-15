const Admin = require('../../models/Admin');
const {
    loginValidation
} = require('../../utility/validation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
    try {

        const { error } = loginValidation(req.body);
        if (error) {
            return res.status(400).json(error.details[0].message)
        }

        // Check admin existence in the database
        const admin = await Admin.findOne({ email: req.body.email })
        if (!admin) {
            return res.status(400).json('Sorry email is not with our Admin records');
        }

        // Compare password for accuracy
        const validPassword = await bcrypt.compare(req.body.password, admin.password);
        if (!validPassword) {
            return res.status(400).json('Sorry password is invalid');
        }

        // creating and assigning token
        const token = jwt.sign({
            _id: admin._id,
            admin: true,
            transactionId: admin.transactionId
        },
            process.env.AUTH_TOKEN_SECRET);
        res.header('authentication-token', token).json({"authentication-token": token});
    } catch (err) {
        res.status(500).json(err);
    }
}