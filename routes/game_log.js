const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('users/game_log')
})

module.exports = router