const router = require('express').Router();
const { userAccess } = require('../utility/validation');const deposit = require('../controllers/user/deposit');
const withdraw = require('../controllers/user/withdraw');
const transfer = require('../controllers/user/transfer');
const transactions = require('../controllers/user/transactions');

// user deposit route which bears an amount query param
router.post('/deposit', userAccess, deposit)

// user withdraw route
router.post('/withdraw', userAccess, withdraw)

// user transfer route
router.post('/transfer', userAccess, transfer)

// user list of transactions route
router.get('/transactions', userAccess, transactions)

module.exports = router

/**
 * Deposit money --- DONE
 * Withdraw money --- DONE
 * Transfer funds to other users --- DONE
 * See a list of their transactions --- DONE
 */