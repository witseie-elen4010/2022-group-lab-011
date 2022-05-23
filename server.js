'use strict'

const express = require('express')
const app = express()

app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.set('view engine', 'ejs')
app.use(logger)

const createRouter = require('./routes/create')
const userRouter = require('./routes/users')
const homeRouter = require('./routes/home')
const gameRouter = require('./routes/game')

app.use('/create', createRouter)
app.use('/users', userRouter)
app.use('/home', homeRouter)
app.use('/game', gameRouter)


function logger(req, res, next) {
    console.log(req.originalUrl)
    next()
}

const port = process.env.PORT || 3000
app.listen(port)
console.log('Listening to port: ', port)
