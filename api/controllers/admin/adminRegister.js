const Admin = require('../../models/Admin');
const {
    adminRegistrationValidation
} = require('../../utility/validation');
const bcrypt = require('bcrypt');
const Transaction = require('../../models/Transaction');
const generateRandomNumber = require('../../utility/generateRandomNumber');

module.exports = async (req, res) => {
    const { error } = adminRegistrationValidation(req.body)
    if (error) {
        return res.status(400).json(error.details[0].message);
    }

    // check for existence in the MongoDb database
    const emailExists = await Admin.findOne({ email: req.body.email });
    if (emailExists) {
        return res.status(400).json('Email already in the Admin database');
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    // generate transactionId, check whether it alrady exist and add to model
    let transactionId = generateRandomNumber(20)
    let transactionExist = await Transaction.findOne({ 'transactionId': transactionId })
    while (transactionExist) {
        transactionId = generateRandomNumber(20)
        transactionExist = await Transaction.findOne({ transactionId: transactionId })
    }
    
    // create new transaction and admin model
    const transactionModel = new Transaction({
        transactionId: transactionId
    })

    const admin = new Admin({
        ...req.body,
        password: hashedPassword,
        transactionId: transactionId
    })

    console.log(transactionModel)
    try {
        //saving the newly created Admin and Transaction Model
        await transactionModel.save();
        await admin.save();
        res.status(200).json("Admin registration was successful")
    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
}