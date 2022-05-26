const express = require('express')
const router = express.Router()
const db = require('../dbconfig.js')

router.get('/', (req, res) => {
    res.render('users/lobby')
})

router.post('/', (req, res) => {
    console.log('Button was clicked')

    if (!req.session.ID) {
      res.redirect('/login')
      } else {
    const playerRole = req.body.game_role
    const accountId = req.session.ID
    db.pools
    // Run query
    .then((pool) => {
        return pool.request()
            //find if account is already in waiting lobby
            .input('accountId', accountId)
            .query('Select account_id from dbo.game_lobby where account_id = @accountId;')         
        })
        // Send back the result
        .then(result => {
        if (result.recordset.length === 0) {
          console.log("at insert")
            db.pools
            // Run query
            .then((pool) => {
                return pool.request()
                  // insert user into lobby
                .input('account_id', accountId)
                .input('player_role', playerRole)
                .query('INSERT INTO dbo.game_lobby (account_id, player_role) VALUES (@account_id, @player_role);')
            })
            // Succesfully inserted into lobby
            .then(result => {  
                res.redirect('/multi_game')
                console.log("attempt selected")
                  db.pools
                  // Run query
                  .then((pool) => {
                      return pool.request()
                        // insert user into lobby
                        .input('account_id', accountId)
                        .input('player_role', playerRole)
                        .query('SELECT * FROM dbo.game_lobby;')
                  })
                  .then(result => {
                    console.log("selected")
                    console.log(result)
                    if (result.recordset.length === 2) {
                        console.log("Create game")
                    } else {
                      //code for already in lobby
                      //res.redirect('/multi_game')
                    }
                  })
            })
            // If there's an error, return that with some description
            .catch(err => {
                res.send({ Error: err })
            })
            } else {
              //code for already in lobby
              return res.redirect('/multi_game')
            }
          })
          // If there's an error, return that with some description
          .catch(err => {
            res.send({ Error: err })
          })
        }

})

module.exports = router