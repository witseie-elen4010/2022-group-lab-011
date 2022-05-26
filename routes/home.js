const express = require('express')
const router = express.Router()
const session = require('express-session');

router.get('/', (req, res) => {
    console.log(req.session.ID)
    if (!req.session.ID) {
        res.redirect('/login')
        } else {
    res.render('users/home')
    }
})

module.exports = router