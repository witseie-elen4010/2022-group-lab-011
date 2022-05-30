const express = require('express')
const router = express.Router()
const db = require('../dbconfig.js')

router.get('/', (req, res) => {
    if (!req.session.ID) {
        res.redirect('/')
        } else {
    res.render('users/leaderboard')
    console.log("at leaderboard db insert")
    //const accountId = req.session.ID
    const accountId = 1
    const username = 'Test Name'
    let game_count = 1
    let score = 4
    let average_score = score/game_count
    /*db.pools
            // Run query
            .then((pool) => {
                return pool.request()
                  // insert user into lobby
                .input('id', accountId)
                .input('account_id', accountId)
                .input('username', username)
                .input('game_count', game_count)
                .input('score', score)
                .input('average_score', average_score)
                .query('INSERT INTO dbo.leaderboard (id, account_id, username, game_count, score, average_score) VALUES (@id, @account_id, @username, @game_count, @score, @average_score);')
            })*/
    console.log("at leaderboard db select")
    db.pools
    // Run query
        .then((pool) => {
            return pool.request()
            // Select leaderboard
            .query('SELECT * FROM dbo.leaderboard;')
        })
            .then(result => {
                let x = result.recordset
                console.log(x)
            })
        .catch(err => {
            res.send({ Error: err })
            })
                
                





    }
})

module.exports = router