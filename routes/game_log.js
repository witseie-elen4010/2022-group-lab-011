const express = require('express')
const router = express.Router()
const db = require('../dbconfig.js')

router.get('/', (req, res) => {
    if (!req.session.ID) {
        res.redirect('/login')
    } else {
        //const accountId = req.session.ID
        const id = 1
        const game_id = 1
        let account_id = 2
        let opponent_username = 'ben'
        let admin_username = '123'
        let guess_1 = 'hello'
        let guess_2 = 'local'
        let guess_3 = 'grape'
        let guess_4 = ''
        let guess_5 = ''
        let guess_6 = ''
        let word = 'grape'

        // this is here just to show how to insert new data onto the DB
        /*db.pools
                // Run query
                .then((pool) => {
                    return pool.request()
                    // insert user into lobby
                    .input('id', id)
                    .input('game_id', game_id)
                    .input('account_id', account_id)
                    .input('opponent_username', opponent_username)
                    .input('admin_username', admin_username)
                    .input('guess_1', guess_1)
                    .input('guess_2', guess_2)
                    .input('guess_3', guess_3)
                    .input('guess_4', guess_4)
                    .input('guess_5', guess_5)
                    .input('guess_6', guess_6)
                    .input('word', word)
                    .query('INSERT INTO dbo.game_log (id, game_id, account_id, opponent_username, admin_username, guess_1, guess_2, guess_3, guess_4, guess_5, guess_6, word) VALUES (@id, @game_id, @account_id, @opponent_username, @admin_username, @guess_1, @guess_2, @guess_3, @guess_4, @guess_5, @guess_6, @word);')
                })*/
        db.pools
        // Run query
            .then((pool) => {
                return pool.request()
                // Select leaderboard
                .query('SELECT * FROM dbo.game_log;')
            })
            .then(result => {
                let columns = ['id', 'game_id', 'account_id', 'opponent_username', 'admin_username', 'guess_1', 'guess_2', 'guess_3', 'guess_4', 'guess_5', 'guess_6', 'word']
                let cols = columns.length
                let rows = result.recordset.length
                if (rows > 0) {
                    const myTable = Array.from(Array(rows), () => new Array(cols));
                    for (let row = 0; row < rows; row++) {
                        for (let col = 0; col < cols; col++) {
                            let x = result.recordsets[0][row][columns[col]]
                            myTable [row] [col] = x
                        }
                    }
                    console.log(myTable)
                    game_log.stats = myTable
                }
                res.render('users/game_log', {data: game_log})
            })
            .catch(err => {
                res.send({ Error: err })
            })
        }
})

const game_log = {
    name : 'game_log',
    stats: []
}

module.exports = router