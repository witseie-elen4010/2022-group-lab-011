const express = require('express')
const router = express.Router()
const session = require('express-session');
const FileStore = require('session-file-store')(session)
const db = require('../dbconfig.js')
const bcrypt = require('bcrypt')

router.get('/', (req, res) => {
  if (req.session.ID) {
    req.session.destroy()
  }
  res.render('users/login')
})

router.post('/', (req, res) => {
    let username = req.body.username
    let password = req.body.password
  
  //  retrieve account with specified username
  db.pools
  // SQL
  .then((pool) => {
    return pool.request()
      .input('username', username)
      .query('SELECT password, id FROM dbo.accounts WHERE username = @username;')
  })
// Compare hashed passsword with entered result
  .then(async (result) => {
    if (result.recordset.length !== 0){
    if (await bcrypt.compare(password, result.recordset[0].password)) {      
      // Login success
      sessData = req.session
      sessData.ID = result.recordset[0].id
      console.log(req.session.ID)
      newAction(req.session.ID, 'LOGIN')
      return res.redirect('/home')
      // Login failed
    } else {
      //SAY INCORRECT LOGIN CREDENTIALS
      return res.redirect('/login')
    }
  } else {
    return res.redirect('/login')
  }
  })
// database error
  .catch(err => {
    res.send({ Error: err })
  })
  
})

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