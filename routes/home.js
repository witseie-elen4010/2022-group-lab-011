const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    //res.send('heollooooo!!!!!')
    res.render('users/home')
})

router.post('/', (req, res) => {
    res.redirect('/game')
})


function play(res, req, next) {
    console.log(req.originalUrl)
    res.send('yessir!!')
    next()
}

module.exports = router