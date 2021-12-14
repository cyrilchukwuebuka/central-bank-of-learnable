const router = require('express').Router();
const {
    adminAccess
} = require('../utility/validation');
const adminLogin = require('../controllers/admin/adminLogin');
const adminRegister = require('../controllers/admin/adminRegister');
const getUsers = require('../controllers/admin/getUsers');
const deleteUser = require('../controllers/admin/deleteUser');
const reverseTransaction = require('../controllers/admin/reverseTransaction');
const disableUser = require('../controllers/admin/disableUser');
const enableUser = require('../controllers/admin/enableUser');
const getTransactions = require('../controllers/admin/getTransactions');

// login as an Admin
router.post('/login', adminLogin)

// register as an Admin
router.post('/register', adminRegister);

// fetch list of all registered users
router.get('/users', adminAccess, getUsers)

// deletes a specified user
router.delete('/delete/:userAccount', adminAccess, deleteUser)

// reverse transaction
router.post('/reverse-transaction/:transactionID', adminAccess, reverseTransaction)

// disables a user account
router.put('/deactivate-account/:userAccount', adminAccess, disableUser)

// reactivate disabled user account
router.put('/reactivate-account/:userAccount', adminAccess, enableUser)

// list of all transactions ever made
router.get('/transactions', adminAccess, getTransactions)

module.exports = router

/**
 * can add users <This function is to be solved at the auth register route> --- DONE
 * can get all users --- DONE
 * can delete user --- DONE
 * reverse transaction(transfer)
 * Disable User's account --- DONE
 */