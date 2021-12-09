const router = require('express').Router();

router.get('/', async (req, res) => {
    console.log('REQ >>>', res)
    res.send('<h1>Welcome to Central Bank Of Learnable 🏦</h1>')
})

module.exports = router