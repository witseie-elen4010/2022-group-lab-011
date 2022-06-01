const express = require('express')
const router = express.Router()
const session = require('express-session');
const FileStore = require('session-file-store')(session)
const db = require('../dbconfig.js')
const bcrypt = require('bcrypt')

router.get('/', (req, res) => {

  if (req.session.ID) {
    req.session.destroy(function(err) {
      if (err) {
        console.error(err);
      } else {
        //res.cookie.
        res.redirect('/');
      }
    })
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
      .query('Select password, id from dbo.accounts where username = @username;')
  })
// Compare hashed passsword with entered result
  .then(async (result) => {
    if (await bcrypt.compare(password, result.recordset[0].password)) {      
      // Login success
      sessData = req.session
      sessData.ID = result.recordset[0].id
      console.log(req.session.ID)   
      return res.redirect('/home')
      // Login failed
    } else {
      //SAY INCORRECT LOGIN CREDENTIALS
      return res.redirect('/login')
    }
  })
// database error
  .catch(err => {
    res.send({ Error: err })
  })

})

module.exports = router