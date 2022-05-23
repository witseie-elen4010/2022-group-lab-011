const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('users/create')
})

router.post('/', (req, res) => {
    let a = req.body.username
    let b = req.body.email
    let c = req.body.password
    let d = req.body.confirm_password
    console.log(a)
    console.log(b)
    console.log(c)
    console.log(d)
    //users.push( {username: x, password: y})
    //z = users.length - 1
    res.redirect('/users/new')
})

module.exports = router