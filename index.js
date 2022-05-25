'use strict'

const express = require('express')
const app = express()
const db = require('./dbconfig.js')

app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.set('view engine', 'ejs')
app.use(logger)

const createRouter = require('./routes/create_account')
const loginRouter = require('./routes/login')
const homeRouter = require('./routes/home')
const gameRouter = require('./routes/solo_game')
const leadRouter = require('./routes/leaderboard')
const gameLogRouter = require('./routes/game_log.js')

//Define routes
app.use('/create_account', createRouter)
app.use('/login', loginRouter)
app.use('/home', homeRouter)
app.use('/solo_game', gameRouter)
app.use('/leaderboard', leadRouter)
app.use('/game_log', gameLogRouter)


function logger(req, res, next) {
    console.log(req.originalUrl)
    next()
}

module.exports = app

const port = process.env.PORT || 3000
app.listen(port)
console.log('Listening to port: ', port)


