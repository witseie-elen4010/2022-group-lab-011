'use strict'

const express = require('express')
const app = express()

app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.set('view engine', 'ejs')
app.use(logger)

const userRouter = require('./routes/users')
const homeRouter = require('./routes/home')
const gameRouter = require('./routes/game')

app.use('/users', userRouter)
app.use('/home', homeRouter)
app.use('/game', gameRouter)

function logger(req, res, next) {
    console.log(req.originalUrl)
    next()
}

const port = process.env.PORT || 3000
app.listen(port)
console.log('Express server running on port', port)
