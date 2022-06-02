const express = require('express')
const router = express.Router()
const db = require('../dbconfig.js')

router.get('/', (req, res) => {
    if (!req.session.ID) {
        res.redirect('/login')
    } else {
        db.pools
        // Run query
            .then((pool) => {
                return pool.request()
                // Select leaderboard
                .query('SELECT * FROM dbo.game_log;')
            })
            .then(result => {
                let columns = ['id', 'game_id', 'account_id', 'opponent_id', 'admin_id', 'guess_1', 'guess_2', 'guess_3', 'guess_4', 'guess_5', 'guess_6', 'word']
                let cols = columns.length
                let rows = result.recordset.length
                if (rows > 0) {
                    const myTable = Array.from(Array(rows), () => new Array(cols));
                    for (let row = 0; row < rows; row++) {
                        for (let col = 0; col < cols; col++) {
                            let x = result.recordsets[0][row][columns[col]]
                            if (columns[col] === 'game_id' && x === 0) x = 'SOLO'
                            if (columns[col] === 'game_id' && x === 1) x = 'MULTI'
                            if (columns[col] === 'opponent_id' && x === 0) x = '-'
                            if (columns[col] === 'admin_id' && x === 0) x = '-'
                            myTable [row] [col] = x
                        }
                    }
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