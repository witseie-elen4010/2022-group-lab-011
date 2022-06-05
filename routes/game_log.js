const express = require('express')
const router = express.Router()
const db = require('../dbconfig.js')

router.get('/', (req, res) => {
    if (!req.session.ID) {
        res.redirect('/login')
    } else {
        const myID = req.session.ID
        db.pools
        // Run query
            .then((pool) => {
                return pool.request()
                // Select game log
                .query('SELECT * FROM dbo.solo_game_log JOIN dbo.accounts ON dbo.solo_game_log.account_id = dbo.accounts.id;')
            })
            .then(result => {
                let columns = ['id', 'username', 'guess_1', 'guess_2', 'guess_3', 'guess_4', 'guess_5', 'guess_6', 'word']
                let cols = columns.length
                let rows = result.recordset.length
                let x
                if (rows > 0) {
                    const myTable = Array.from(Array(rows), () => new Array(cols));
                    for (let row = 0; row < rows; row++) {
                        for (let col = 0; col < cols; col++) {
                            if (columns[col] === 'id') {
                                x = row + 1
                            } else {
                                x = result.recordsets[0][row][columns[col]]
                            }
                            myTable [row] [col] = x
                        }
                    }
                    solo_game_log.stats = myTable
                }
            })
            .then(result => {
                db.pools
                // Run query
                .then((pool) => {
                    return pool.request()
                    // Select game log
                    .query('SELECT * FROM dbo.multi_game_log JOIN dbo.accounts ON dbo.multi_game_log.account_id = dbo.accounts.id;')
                })
                .then(result => {
                    let columns = ['id', 'game_id', 'username', 'opponent_id', 'admin_id', 'guess_1', 'guess_2', 'guess_3', 'guess_4', 'guess_5', 'guess_6', 'word', 'result']
                    let cols = columns.length
                    let rows = result.recordset.length
                    if (rows > 0) {
                        const myTable = Array.from(Array(rows), () => new Array(cols));
                        for (let row = 0; row < rows; row++) {
                            for (let col = 0; col < cols; col++) {
                                if (columns[col] === 'id') {
                                    x = row + 1
                                } else {
                                    x = result.recordsets[0][row][columns[col]]
                                    if (columns[col] === 'admin_id' && x === 0) x = 'NO ADMIN'
                                }
                                myTable [row] [col] = x
                            }
                        }
                        multi_game_log.stats = myTable
                    }
                    res.render('users/game_log', {data_multi: multi_game_log, data_solo: solo_game_log, id: myID})
                })
            })

            .catch(err => {
                res.send({ Error: err })
            })
        }
})

const solo_game_log = {
    name : 'solo_game_log',
    stats: []
}

const multi_game_log = {
    name : 'multi_game_log',
    stats: []
}

module.exports = router