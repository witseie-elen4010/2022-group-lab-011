'use strict'

const express = require('express')
const app = express()
const session = require('express-session');
const FileStore = require('session-file-store')(session)


app.use(session({
  store: new FileStore(),
  secret: 'easypeasyazsdfahsdghasdh',
  resave: false,
  saveUninitialized: false
})
)

app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.set('view engine', 'ejs')
app.use(logger)

const createRouter = require('./routes/create_account')
const loginRouter = require('./routes/login')
const homeRouter = require('./routes/home')
const soloGameRouter = require('./routes/solo_game')
const leadRouter = require('./routes/leaderboard')
const gameLogRouter = require('./routes/game_log')
const lobbyRouter = require('./routes/lobby')
const multiGameRouter = require('./routes/multi_game')

//Define routes
app.use('/create_account', createRouter)
app.use('/login', loginRouter)
app.use('/home', homeRouter)
app.use('/solo_game', soloGameRouter)
app.use('/leaderboard', leadRouter)
app.use('/game_log', gameLogRouter)
app.use('/lobby', lobbyRouter)
app.use('/multi_game', multiGameRouter)


function logger(req, res, next) {
    console.log(req.originalUrl)
    next()
}

module.exports = app

const port = process.env.PORT || 3000
app.listen(port)
console.log('Listening to port: ', port)

