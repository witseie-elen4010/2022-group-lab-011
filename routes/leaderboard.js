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
            // Select leaderboard
            .query('SELECT * FROM dbo.leaderboard JOIN dbo.accounts ON dbo.leaderboard.account_id = dbo.accounts.id ORDER BY average_score DESC;')
        })
            .then(result => {
                console.log(result)
                let columns = ['id', 'account_id', 'username', 'game_count', 'score', 'average_score']
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
                    leaderboard.stats = myTable
                }
                res.render('users/leaderboard', {data: leaderboard, id: myID})
            })
        .catch(err => {
            res.send({ Error: err })
            })
    newAction(req.session.ID, 'VIEWED: LEADERBOARD')    
    }
})

const leaderboard = {
    name : 'leaderboard',
    stats: []
}

function newAction(user_ID, action_details) {
    // enter action into the actions log
    const account_id = user_ID
    const action = action_details
    let current = new Date();
    let cDate = current.getFullYear() + '-' + (current.getMonth() + 1) + '-' + current.getDate();
    let cTime = current.getHours() + ":" + current.getMinutes() + ":" + current.getSeconds();
    let time = cDate + ' ' + cTime;
    db.pools
      .then((pool) => {
          return pool.request()
          .input('account_id', account_id)
          .input('action', action)
          .input('time', time)
          .query('INSERT INTO dbo.actions (account_id, action, time) VALUES (@account_id, @action, @time);')
      })
  }

module.exports = router