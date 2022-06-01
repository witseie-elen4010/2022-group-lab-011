'use strict'

const express = require('express')
const app = express()
const session = require('express-session');
const FileStore = require('session-file-store')(session)
const cookieParser = require('cookie-parser')
const db = require('./dbconfig.js')

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
app.use(cookieParser())
app.set('view engine', 'ejs')
app.use(logger)

const createRouter = require('./routes/create_account')
const loginRouter = require('./routes/login')
const homeRouter = require('./routes/home')
const soloGameRouter = require('./routes/wordle_solo')
const leadRouter = require('./routes/leaderboard')
const gameLogRouter = require('./routes/game_log')
const lobbyRouter = require('./routes/lobby')
const multiGameRouter = require('./routes/multi_game')

//Define routes
app.use('/create_account', createRouter)
app.use('/login', loginRouter)
app.use('/home', homeRouter)
app.use('/wordle_solo', soloGameRouter)
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

//Wordle functionaliity

app.get('/word', (req, res) => {
  res.json('hello')
})

app.get('/check', (req, res) => {
  const word = req.query.word
  res.json("found")
})

app.get('/game_end', (req, res) => {
  const wordsArr = req.query.wordEntries 
  const words = wordsArr.split(",")
  let new_score
  let wordAns = []
  for (let i = 0; i < 7; i++){
    let tempWord = ''
    if (i !==6){
      for (let j = 0; j < 5; j++){
      tempWord = tempWord + words[i*5 + j]
      }
    } else {
      tempWord = tempWord + words[i*5]
      new_score = words[(i*5)+1]
    }
    wordAns[i] = tempWord
  }
  db.pools
  // Run query
  .then((pool) => {
    return pool.request()
    // This is only a test query, change it to whatever you need
    .input('game_id', 0)
    .input('account_id', req.session.ID)
    .input('opponent_id', 0)
    .input('admin_id', 0)
    .input('guess_1', wordAns[0])
    .input('guess_2', wordAns[1])
    .input('guess_3', wordAns[2])
    .input('guess_4', wordAns[3])
    .input('guess_5', wordAns[4])
    .input('guess_6', wordAns[5])
    .input('word', wordAns[6])
    //.query('INSERT INTO dbo.game_log (game_id, account_id, opponent_id, admin_id, guess_1, guess_2, guess_3, guess_4, guess_5, guess_6, word) VALUES (@game_id, @account_id, @opponent_id, @admin_id, @guess_1, @guess_2, @guess_3, @guess_4, @guess_5, @guess_6, @word);')
  })
  .catch(err => {
    res.send({Error: err })
  })
  // set variables
  const account_id = req.session.ID
  // get username from accounts database
    db.pools
    // Run query
    .then((pool) => {
      return pool.request()
        .input('account_id', account_id)
        .query('Select account_id from dbo.leaderboard where account_id = @account_id;') // check if user exists in DB        
    })
    .then(result => {
      if (result.recordset.length === 0) { 
        // insert new user into leaderboard
        db.pools
        // Run query
        .then((pool) => {
            // get data to input into leaderboard
            let game_count = 1
            let score = new_score
            let average_score = score/game_count
            // insert user into leaderboard
            return pool.request()
            .input('account_id', account_id)
            .input('game_count', game_count)
            .input('score', new_score)
            .input('average_score', average_score)
            .query('INSERT INTO dbo.leaderboard (account_id, game_count, score, average_score) VALUES (@account_id, @game_count, @score, @average_score);')
        })
      } else {
        // update user in leaderboard
        db.pools
        .then((pool) => {
          // info 
          return pool.request()
            .input('account_id', account_id)
            .input('new_score', new_score)
            .query('UPDATE dbo.leaderboard SET game_count = game_count+1, score = score + @new_score, average_score = (score + @new_score)/(game_count+1) WHERE account_id = @account_id;')
        })
      }
    })
  
})