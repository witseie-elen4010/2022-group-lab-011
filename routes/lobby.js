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
    let playerOne
    let playerTwo
    let playerAdmin
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
                        // Select game players
                        .input('player_role', 0)
                        .query('SELECT TOP 2 * FROM dbo.game_lobby WHERE player_role = @player_role;')
                  })
                  .then(result => {
                    console.log("selected")
                    console.log(result)
                    if (result.recordset.length > 0) {
                      playerOne = result.recordset[0].account_id
                    }
                    if (result.recordset.length > 1) {
                      playerTwo = result.recordset[1].account_id
                    }
                    if (result.recordset.length === 2) {
                      console.log("create game")
                      db.pools
                      // Run query
                        .then((pool) => {
                            return pool.request()
                             // Select game admins
                              .input('player_role', 1)
                              .query('SELECT TOP 1 * FROM dbo.game_lobby WHERE player_role = @player_role;')
                      .then(result => {
                        if (result.recordset.length === 1) {
                          playerAdmin = result.recordset[0].account_id
                        } else{
                          playerAdmin = 0
                        }                   
                        db.pools
                      // Run query
                        .then((pool) => {
                            return pool.request()
                             // Select game admins
                              .input('player_one', playerOne)
                              .input('player_two', playerTwo)
                              .input('player_admin', playerAdmin)
                              .input('word', '')
                              .query('INSERT INTO dbo.games (player_one, player_two, player_admin, word) VALUES (@player_one, @player_two, @player_admin, @word);')  
                        })
                        .then(result => {
                          console.log('game created')
                        })

                      })
                  })
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