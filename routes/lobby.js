const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('users/lobby')
})

router.post('/', (req, res) => {
    console.log('Button was clicked')
})

module.exports = router