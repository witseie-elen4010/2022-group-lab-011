const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    if (!req.session.ID) {
        res.redirect('/')
        } else {
    res.render('users/leaderboard')
    }
})

module.exports = router