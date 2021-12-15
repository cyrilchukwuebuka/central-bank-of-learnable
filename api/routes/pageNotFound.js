const router = require('express').Router();

router.get('**', async (req, res) => {
    res.send('<h1>404 PAGE</h1>')
})

module.exports = router