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

router.post('/', (req, res) => {
    if (!req.session.ID) {
      res.redirect('/login')
      } else {
    console.log('Button was clicked')
    const playerRole = req.body.game_role
    const adminWord = req.body.admin_input
    if (playerRole === 1 && adminWord ) {
      const word = req.body.admin_input
      checkWord(word)
      // set /word page variable - in here for now as backup
      router.get('/word-admin', (req, res) => {
        res.json(word)
      })
    } else {
      res.redirect('/multi_game')
    }
  }
}) 
  
module.exports = router