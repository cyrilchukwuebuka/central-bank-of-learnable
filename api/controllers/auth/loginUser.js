const router = require('express').Router();
const User = require('../../models/User');
const {
    loginValidation
} = require('../../utility/validation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = async (req, res) => {
    try {
        const { error } = loginValidation(req.body);
        if (error) {
            return res.status(400).json(error.details[0].message);
        }

        // Check user existence in the database
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
            return res.status(400).json('Sorry email is not with our user records');
        }

        // Compare password for accuracy
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(400).json('Sorry password is invalid');
        }

        // creating and assigning token
        const token = jwt.sign({
            _id: user._id,
            user: true,
            transactionId: user.transactionId
        },
            process.env.AUTH_TOKEN_SECRET);
        console.log(`{ "authentication-token": ${ token }}`)
        res.status(200).header('authentication-token', token).json({ 'authentication-token': token });
    } catch (err) {
        console.log(err)
    }
}