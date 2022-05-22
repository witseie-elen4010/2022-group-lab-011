const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    console.log(req.query.username)
    res.send('User List')
})

router.get('/new', (req, res) => {
    res.render("users/new")
})   

router.post('/', (req, res) => {
    const isValid = true
    let x = req.body.username
    let y = req.body.password
    if (isValid) {
        users.push( {username: x, password: y})
        z = users.length - 1
        res.redirect('/users/'+z)
    } else {
        console.log("Error")
        res.render('users/new', { username: x})
    }
})

router
    .route("/:id")
    .get((req, res) => {
        let x = req.params.id
        let y = users[x].username
        let z = users[x].password
        res.redirect('/home')
    })
    .put((req, res) => {
        let x = req.params.id
        res.send('Update User with ID '+x)
    })
    .delete((req, res) => {
        let x = req.params.id
        res.send('Delete User with ID '+x)
    })

const users = [{ username: "Kyle", password: "1234"}, { username: "Sally", password: "1234"}]

router.param('id', (req, res, next, id) => {
    req.user = users[id]
    next()
})

module.exports = router