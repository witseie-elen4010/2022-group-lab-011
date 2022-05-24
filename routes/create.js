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
    users.push( {username: a, password: c})
    console.log(users)
    res.redirect('/users/new')
})

const users = [{ username: "Kyle", password: "1234"}, { username: "Sally", password: "1234"}, { username: "admin", password: "admin"}]

module.exports = router