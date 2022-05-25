const express = require('express')
const db = require('../dbconfig.js')
const bcrypt = require('bcrypt')
const router = express.Router()

const cookieParser = require("cookie-parser");
const sessions = require('express-session');

router.get('/', (req, res) => {

    res.render('users/create_account')
})

router.post('/', async (req, res) => {
    const username = req.body.username
    const email = req.body.email
    const password = req.body.password
    const confirmPassword = req.body.confirm_password

    if (password === confirmPassword) {
        const hashedPassword = await bcrypt.hash(password, 10)
        db.pools
        // Run query
          .then((pool) => {
            return pool.request()
              .input('email', email)
              .query('Select email from dbo.accounts where email = @email;')         
          })
          // Send back the result
          .then(result => {
            if (result.recordset.length === 0) {
              db.pools
              // Run query
                .then((pool) => {
                  return pool.request()
                  // This is only a test query, change it to whatever you need
                    .input('username', username)
                    .input('password', hashedPassword)
                    .input('email', email)
                    .query('INSERT INTO dbo.accounts (username, password, email) VALUES (@username, @password, @email);')
                })
              // Send back the result
                .then(result => {
                  return res.redirect('/home')
                })
              // If there's an error, return that with some description
                .catch(err => {
                  res.send({ Error: err })
                })
            } else {
              //code for email in use
              return res.redirect('/create_account')
            }
          })
          // If there's an error, return that with some description
          .catch(err => {
            res.send({ Error: err })
          })
      } else {
        //code for incorrect passwords
        return res.redirect('/create_account')
      }
})


module.exports = router