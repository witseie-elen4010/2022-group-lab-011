const express = require('express')
const db = require('../dbconfig.js')
const bcrypt = require('bcrypt')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('users/create')
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
              .query('Select email from dbo.account where email = @email;')         
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
                    .query('INSERT INTO dbo.account (username, password, email) VALUES (@username, @password, @email);')
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
              return res.redirect('/create')
            }
          })
          // If there's an error, return that with some description
          .catch(err => {
            res.send({ Error: err })
          })
      } else {
        return res.redirect('/create')
      }
})

module.exports = router