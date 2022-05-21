const express = require('express')
const router = express.Router()

//router.get('/', (req, res) => {
//    res.send('Yessir!')
//})


router.get('/', (req, res) => {
    //let x = req.params.id
    //let y = users[x].username
    res.render("users/game")
})

module.exports = router