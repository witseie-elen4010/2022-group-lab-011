'use strict'

const express = require('express')
const app = express()
const db = require('./dbconfig.js')

app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.set('view engine', 'ejs')
app.use(logger)

const createRouter = require('./routes/create')
const userRouter = require('./routes/users')
const homeRouter = require('./routes/home')
const gameRouter = require('./routes/game')

//Define routes
app.use('/create', createRouter)
app.use('/users', userRouter)
app.use('/home', homeRouter)
app.use('/game', gameRouter)


function logger(req, res, next) {
    console.log(req.originalUrl)
    next()
}

module.exports = app

const port = process.env.PORT || 3000
app.listen(port)
console.log('Listening to port: ', port)

////////////////////////////////////////
//IMPLEMENTATION
///////////////////////////////////////

app.post('/createnewaccount', async (req, res) => {
    // Make a query to the database
    if (req.body.psw === req.body.psw2) {
      const hashedPassword = await bcrypt.hash(req.body.psw, 10)
      db.pools
      // Run query
        .then((pool) => {
          return pool.request()
            .input('email', req.body.email)
            .query('Select email from dbo.person where email = @email;')
        })
        // Send back the result
        .then(result => {
          if (result.recordset.length === 0) {
            db.pools
            // Run query
              .then((pool) => {
                return pool.request()
                // This is only a test query, change it to whatever you need
                  .input('firstName', req.body.firstname)
                  .input('lastName', req.body.lastname)
                  .input('email', req.body.email)
                  .input('password', hashedPassword)
                  .query('INSERT INTO dbo.person (firstName, lastName, email, password) VALUES (@firstName, @lastName, @email, @password);')
              })
            // Send back the result
              .then(result => {
                return res.redirect('/home')
              })
            // If there's an error, return that with some description
              .catch(err => {
                res.send({ Error: err })
              })
          } else {
            return res.redirect('/createaccount')
          }
        })
        // If there's an error, return that with some description
        .catch(err => {
          res.send({ Error: err })
        })
    } else {
      return res.redirect('/createaccount')
    }
  })