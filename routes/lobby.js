const express = require('express')
const router = express.Router()
const db = require('../dbconfig.js')

router.get('/', (req, res) => {
  if (!req.session.ID) {
      res.redirect('/login')
      } else {
  res.render("users/lobby")
  }
})

module.exports = router