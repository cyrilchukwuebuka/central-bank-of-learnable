const router = require('express').Router();
const User = require('../models/User');
const {
    adminRegistrationValidation,
    loginValidation,
    adminAccess
} = require('../utility/validation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



module.exports = router

/**
 * Deposit money
 * Withdraw money
 * Transfer funds to other users
 * See a list of their transactions
 */