const express = require('express')
const router = express.Router()
const db = require('../dbconfig.js')

router.get('/', (req, res) => {
    if (!req.session.ID) {
        res.redirect('/login')
        } else {
    //res.render('users/leaderboard')
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
    db.pools
    // Run query
        .then((pool) => {
            return pool.request()
            // Select leaderboard
            .query('SELECT * FROM dbo.leaderboard;')
        })
            .then(result => {
                let columns = ['id', 'account_id', 'username', 'game_count', 'score', 'average_score']
                let cols = columns.length
                let rows = result.recordset.length
                if (rows > 0) {
                    const table = Array.from(Array(rows), () => new Array(cols));
                    for (let row = 0; row < rows; row++) {
                        for (let col = 0; col < cols; col++) {
                            let x = result.recordsets[0][row][columns[col]]
                            table [row] [col] = x
                        }
                    }
                    console.log(table)
                }
                res.render('users/leaderboard', {table: table})
            })
        .catch(err => {
            res.send({ Error: err })
            })
    }
})

module.exports = router