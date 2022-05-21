const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    console.log('get of home')
    //res.send('heollooooo!!!!!')
    res.render('users/home')
})

router.post('/', (req, res, id) => {
    if (id==="playgame"){
        console.log('post of home')
        //res.redirect('/game')
    }
    let x = req.playgame
    console.log(x)
    //console.log('post of home')
    //res.redirect('/game')
})

function play(res, req, next) {
    console.log(req.originalUrl)
    res.send('yessir!!')
    next()
}


module.exports = router