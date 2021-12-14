const router = require('express').Router();
const { adminAccess } = require('../utility/validation');
const loginUser = require('../controllers/auth/loginUser');
const registerUser = require('../controllers/auth/registerUser');

// user login route
router.post('/login', loginUser)

// user registration route
router.post('/register', adminAccess, registerUser)

module.exports = router;
