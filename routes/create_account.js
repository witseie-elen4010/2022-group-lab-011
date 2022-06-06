const express = require('express')
const db = require('../dbconfig.js')
const bcrypt = require('bcrypt')
const router = express.Router()

router.get('/', (req, res) => {
    
    if (req.session.ID) {
      req.session.destroy()
    }
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
              .input('username', username)
              .query('Select username from dbo.accounts where username = @username;')         
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
                  db.pools
                  .then((pool) => {
                    return pool.request()
                    // This is only a test query, change it to whatever you need
                      .input('username', username)
                      .query('SELECT id FROM dbo.accounts id WHERE (username = @username);')
                  })
                  .then(result => {
                    console.log('been created and found id ' +result.recordset[0].id )
                    req.session.ID = result.recordset[0].id
                    db.pools
                    .then((pool) => {
                      return pool.request()
                      // This is only a test query, change it to whatever you need
                        .input('account_id', result.recordset[0].id)
                        .input('game_count', 0)
                        .input('score', 0)
                        .input('average_score', 0)
                        .query('INSERT INTO dbo.rankings (account_id, game_count, score, average_score) VALUES (@account_id, @game_count, @score, @average_score);')
                    })
                    .then(result => {
                      return res.redirect('/home')

                    })                   
                  })                 
                })
              // If there's an error, return that with some description
                .catch(err => {
                  res.send({ Error: err })
                })
            } else {
              //code for username in use
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