const express = require('express')
const router = express.Router()
const session = require('express-session');
const db = require('../dbconfig.js')

router.get('/', (req, res) => {
    console.log(req.session.ID)
    if (!req.session.ID) {
        res.redirect('/login')
        } else {
            const id = req.session.ID
            db.pools
                // Run query
                .then((pool) => {
                    return pool.request()
                    // Select leaderboard
                    .input('id', id)
                    .query('Select username from dbo.accounts where id = @id;') 
                })
                .then(result => {
                    let x = result.recordset[0]['username']
                    res.render('users/home', {name: x})
                })
    }
})

module.exports = router