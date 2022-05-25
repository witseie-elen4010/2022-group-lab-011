const express = require('express')
const router = express.Router()

const users = [{ username: "Kyle", password: "1234"}, { username: "Sally", password: "1234"}, { username: "admin", password: "admin"}]

router.get('/', (req, res) => {
    res.render('users/login')
})

router.get('/login', (req, res) => {
    res.render("users/login")
})   

router.post('/', (req, res) => {
    let x = req.body.username
    let y = req.body.password
    let isValid = validateLogin(x, y, users)
    if (isValid != undefined) {
        res.redirect('/login/'+isValid)
    } else {
        console.log("Error")
        res.render('users/login', { username: x})
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

router.param('id', (req, res, next, id) => {
    req.user = users[id]
    next()
})

function validateLogin(username_, password_, users_){
    let temp
    for (let i=0; i < users_.length; i++){
        if (username_ === users_[i].username){
            temp = i
        }
    }
    if (temp === undefined){
        return undefined
    }
    if (users_[temp].password === password_){
        return temp
    }
    else {
        return undefined
    }
}

module.exports = router