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
    let isValid = validateEntries(a,b,c,d) // check entries of register page
    console.log("isValid")
    console.log(isValid)
    if (isValid != false) {
      res.redirect('users/new') // succesfully registered - go to login page
  } else {
      console.log("Error in registration")
      res.redirect('/create')
     
  }
    
})
function validateEntries (username_,email_,password_,confirmPassword_) {
    if (username_.length <= 0 || password_.length <= 0 || confirmPassword_.length <= 0 || email_.length <= 0) {
      return false
    } else {
      if (password_ === confirmPassword_ && password_.length > 0) {
        return true
      } else {
        return false
      }
    }
  }
  
const users = [{ username: "Kyle", password: "1234"}, { username: "Sally", password: "1234"}, { username: "admin", password: "admin"}]

module.exports = router