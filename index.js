'use strict'

const express = require('express')
const path = require('path')
const http = require('http')
const session = require('express-session');
const FileStore = require('session-file-store')(session)
const cookieParser = require('cookie-parser')
const db = require('./dbconfig.js')
const socketio = require('socket.io')
const app = express()
const server = http.createServer(app)
const io = socketio(server)

require("dotenv").config()
const axios = require("axios").default

app.use(session({
  store: new FileStore(),
  secret: 'easypeasyazsdfahsdghasdh',
  resave: false,
  saveUninitialized: false
})
)

app.use(express.static(path.join(__dirname, "public")))
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
const actionsLogRouter = require('./routes/actions_log')
const lobbyRouter = require('./routes/lobby')
const rulesRouter = require('./routes/rules')
const multiGameRouter = require('./routes/wordle_multi')
const { json } = require('body-parser')

//Define routes
app.use('/create_account', createRouter)
app.use('/login', loginRouter)
app.use('/home', homeRouter)
app.use('/wordle_solo', soloGameRouter)
app.use('/leaderboard', leadRouter)
app.use('/game_log', gameLogRouter)
app.use('/actions_log', actionsLogRouter)
app.use('/lobby', lobbyRouter)
app.use('/rules', rulesRouter)
app.use('/wordle_multi', multiGameRouter)


function logger(req, res, next) {
  console.log(req.originalUrl)
  next()
}

const port = process.env.PORT || 3000
server.listen(port)
console.log('Listening to port: ')

////////////////////////////////////////////////////
//Wordle database functionality
////////////////////////////////////////////////////

app.get('/to-multi', (req, res) => {
  res.redirect('../views/users/wordle_multi')
})

app.get('/userID', (req, res) => {
  res.json(req.session.ID)
})

app.get('/userName', (req, res) => {
  let accountId = req.query.accountId
  db.pools
    // Run query
    .then((pool) => {
      return pool.request()
        .input('account_id', accountId)
        .query('SELECT username FROM dbo.accounts WHERE id = @account_id;') // check if user exists in DB        
    })
    .then(result => {
      res.json(result.recordset[0].username)
    })
})


app.get('/getGame', (req, res) => {
  const accountId = req.query.accountId
  let records
  console.log('fetch game')
  db.pools
    // Run query
    .then((pool) => {
      return pool.request()
        .input('account_id', accountId)
        .query('SELECT * from dbo.games WHERE player_one = @account_id OR player_TWO = @account_id OR player_admin = @account_id;') // check if user exists in DB        
    })
    .then(result => {
      if (result.recordset.length !== 0) {
        console.log('got game')
        records = result
        db.pools
        // Run query
        .then((pool) => {
          return pool.request()
            .input('account_id', accountId)
            .query('DELETE FROM dbo.games WHERE player_one = @account_id OR player_TWO = @account_id OR player_admin = @account_id;') // check if user exists in DB        
        })
        .then(result => {
          console.log('deleted game entry')
          res.json(records)   
        })
      } else {
        res.json('not in game')
      }
    })
    .catch((error) => {
      console.error(error)
    })
})

app.get('/word', async (req, res) => {
  const options = {
    method: 'GET',
    url: 'https://random-words5.p.rapidapi.com/getMultipleRandom',
    params: { count: '1', wordLength: '5' },
    headers: {
      'x-rapidapi-host': 'random-words5.p.rapidapi.com',
      'x-rapidapi-key': process.env.RAPID_API_KEY1
    }
  }
  axios.request(options).then((response) => {
    console.log(response.data)
    res.json(response.data[0])
  }).catch((error) => {
    console.error(error)
    return error
  })
})

app.get('/check', (req, res) => {
  const word = req.query.word

  const options = {
    method: 'GET',
    url: 'https://twinword-word-graph-dictionary.p.rapidapi.com/association/',
    params: { entry: word },
    headers: {
      'x-rapidapi-host': 'twinword-word-graph-dictionary.p.rapidapi.com',
      'x-rapidapi-key': process.env.RAPID_API_KEY2
    }
  }
  axios.request(options).then((response) => {
    console.log(response.data)
    res.json(response.data.result_msg)
  }).catch((error) => {
    console.error(error)
  })
})

app.get('/log-guess-solo', (req, res) => {
  const data = req.query.data
  let ID = req.session.ID
  let msg = data
  newAction(ID, msg)
})


app.get('/set-multi-log', (req, res) => {
  //enter game into multi player logs
  let records = req.query.multiGameData
  records = records.split(',')
  db.pools
  .then((pool) => {
    return pool.request()
    .input('game_id', records[0])
    .input('account_id', records[1])
    .input('opponent_id', records[2])
    .input('admin_id', records[3])
    .input('guess_1', '')
    .input('guess_2', '')
    .input('guess_3', '')
    .input('guess_4', '')
    .input('guess_5', '')
    .input('guess_6', '')
    .input('word', records[4])
    .input('winner', '')
    .query('INSERT INTO dbo.multi_game_log (game_id, account_id, opponent_id, admin_id, guess_1, guess_2, guess_3, guess_4, guess_5, guess_6, word, winner) VALUES (@game_id, @account_id, @opponent_id, @admin_id, @guess_1, @guess_2, @guess_3, @guess_4, @guess_5, @guess_6, @word, @winner);')     
  })
  .then(result => {
    console.log('entered into multi log')
    res.json(records)
  })   
})

app.get('/enter-multi-leaderboard', (req, res) => {
  let data = req.query.data
  data = data.split(',')
  let winner = data[0]
  let accountId = data[1]
  let opponentId = data[2]


    //increase game counts
    db.pools
    .then((pool) => {
      return pool.request()
      .input('account_id', accountId)
      .input('oppenent_id', opponentId)
      .query(`UPDATE dbo.rankings SET game_count = game_count + 1, score = score, average_score = (score)/(game_count + 1) WHERE account_id = @account_id OR account_id = @oppenent_id;`)     
    })
    .then(result => {
        //increase winners score
        if (winner === 'Won'){
       db.pools
      .then((pool) => {
        return pool.request()
        .input('account_id', accountId)
        .query(`UPDATE dbo.rankings SET game_count = game_count, score = score + 1, average_score = (score +1)/(game_count)  WHERE account_id = @account_id;`)     
        })
        .then(result => {
      
          res.json('word accepted')
         })
        } else if (winner === 'Lost'){
          db.pools
          .then((pool) => {
            return pool.request()
            .input('account_id', opponentId)
            .query(`UPDATE dbo.rankings SET game_count = game_count, score = score + 1, average_score = (score +1)/(game_count)  WHERE account_id = @account_id;`)     
          })
          .then(result => {
      
             res.json('word accepted')
          })
       } else if (winner === 'Draw'){
        db.pools
        .then((pool) => {
          return pool.request()
          .input('account_id', accountId)
          .input('oppenent_id', opponentId)
          .query(`UPDATE dbo.rankings SET game_count = game_count, score = score + 1, average_score = (score +1)/(game_count)  WHERE account_id = @account_id OR account_id = @oppenent_id;`)     
        })
        .then(result => {
    
           res.json('word accepted')
        })
       }
      
    })
  
})


app.get('/enter-multi-word', (req, res) => {
  let data = req.query.data
  data = data.split(',')
  let word = data[0]
  let gameId = data[1]
  let guessNum = 'guess_' + data[2]
  let accountId = req.session.ID
  newAction(accountId, `MULTI WORD GUESS: ${word} IN GAME ${gameId}`)
  console.log(guessNum)
  db.pools
  .then((pool) => {
    return pool.request()
    .input('game_id', gameId)
    .input('word', word)
    .input('account_id', accountId)
    .input('guess_num', guessNum)
    .query(`UPDATE dbo.multi_game_log SET ${guessNum} = @word WHERE (account_id = @account_id AND  game_id = @game_id);`)     
  })
  .then(result => {
    console.log('entered into multi log')
    res.json('word accepted')
  })   
})

app.get('/enter-multi-winner', (req, res) => {
  let data = req.query.data
  data = data.split(',')
  let winner = data[0]
  let winner2
  if (winner === 'Won'){
    winner2 = 'Lost'
  } else if (winner === 'Draw') {
    winner2 = 'Draw'
  } 
  let gameId = data[1]
  let accountId = req.session.ID
  db.pools
  .then((pool) => {
    return pool.request()
    .input('game_id', gameId)
    .input('winner', winner)
    .input('account_id', accountId)
    .query(`UPDATE dbo.multi_game_log SET winner = @winner WHERE (account_id = @account_id AND  game_id = @game_id) ;`)     
  })
  .then(result => {
    if (winner === 'Won'|| winner === 'Draw' ){
    db.pools
    .then((pool) => {
      return pool.request()
      .input('game_id', gameId)
      .input('winner2', winner2)
      .input('account_id', accountId)
      .query(`UPDATE dbo.multi_game_log SET  winner = @winner2 WHERE (account_id != @account_id AND  game_id = @game_id);`)     
    })
    .then(result => {
      console.log('winner entered into multi log')
      res.json('winner accepted')
    })
  }
  })   
})


app.get('/game_end', (req, res) => {
  console.log('Enter into logs')
  const wordsArr = req.query.wordEntries
  const words = wordsArr.split(',')
  let new_score
  let wordAns = []
  for (let i = 0; i < 7; i++) {
    let tempWord = ''
    if (i !== 6) {
      for (let j = 0; j < 5; j++) {
        tempWord = tempWord + words[i * 5 + j]
      }
    } else {
      tempWord = tempWord + words[i * 5]
      new_score = words[(i * 5) + 1]
    }
    wordAns[i] = tempWord
  }
  db.pools
    // Run query
    .then((pool) => {
      return pool.request()
        // This is only a test query, change it to whatever you need
        .input('account_id', req.session.ID)
        .input('guess_1', wordAns[0])
        .input('guess_2', wordAns[1])
        .input('guess_3', wordAns[2])
        .input('guess_4', wordAns[3])
        .input('guess_5', wordAns[4])
        .input('guess_6', wordAns[5])
        .input('word', wordAns[6])
        .query('INSERT INTO dbo.solo_game_log (account_id, guess_1, guess_2, guess_3, guess_4, guess_5, guess_6, word) VALUES (@account_id, @guess_1, @guess_2, @guess_3, @guess_4, @guess_5, @guess_6, @word);')
    })
    .catch(err => {
      res.send({ Error: err })
    })
  // set variables
  const account_id = req.session.ID
  // get username from accounts database
  db.pools
    // Run query
    .then((pool) => {
      return pool.request()
        .input('account_id', account_id)
        .query('SELECT account_id FROM dbo.leaderboard WHERE account_id = @account_id;') // check if user exists in DB        
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
            let average_score = score / game_count
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

function newAction(user_ID, action_details) {
  // enter action into the actions log
  const account_id = user_ID
  const action = action_details
  let current = new Date();
  let cDate = current.getFullYear() + '-' + (current.getMonth() + 1) + '-' + current.getDate();
  let cTime = current.getHours() + ":" + current.getMinutes() + ":" + current.getSeconds();
  let time = cDate + ' ' + cTime;
  db.pools
    .then((pool) => {
      return pool.request()
        .input('account_id', account_id)
        .input('action', action)
        .input('time', time)
        .query('INSERT INTO dbo.actions (account_id, action, time) VALUES (@account_id, @action, @time);')
    })
}

app.get('/game_admin_queue', async (req, res) => {
  const word = req.query.word
  const accountId = req.session.ID
  // Run query
  db.pools
    .then((pool) => {
      return pool.request()
        //find if account is already in waiting lobby
        .input('account_id', accountId)
        .input('word', word)
        .query('INSERT INTO dbo.admin_queue_words (account_id, word) VALUES (@account_id, @word);')
    })
    .then(result => {
      res.json('success!')
      console.log(result)
      newAction(accountId, `MULTI: ${word} WAS ENTERED BY ADMIN`)
    })
})

////////////////////////////////////////////////////
//Multiplayer database functionality and game creation
////////////////////////////////////////////////////

app.get('/game_player_queue', async (req, res) => {
  let playerOne
  let playerTwo
  let playerAdmin
  let word

  const playerRole = req.query.playerType
  const accountId = req.session.ID

  db.pools
    // Run query
    .then((pool) => {
      return pool.request()
        //find if account is already in waiting lobby
        .input('accountId', accountId)
        .query('SELECT account_id FROM dbo.multiplayer_queue WHERE account_id = @accountId;')
    })
    // Send back the result
    .then(result => {
      if (result.recordset.length === 0) {
        console.log("at insert")
        console.log(accountId)
        console.log(playerRole)
        db.pools
          // Run query
          .then((pool) => {
            return pool.request()
              // insert user into lobby
              .input('account_id', accountId)
              .input('player_role', playerRole)
              .query('INSERT INTO dbo.multiplayer_queue (account_id, player_role) VALUES (@account_id, @player_role);')
          })
          // Succesfully inserted into lobby
          .then(result => {
            console.log("attempt selected")
            let type
            if (playerRole === '0') {
              type = 'PLAYER'
            } else {
              type = 'ADMIN'
            }
            newAction(accountId, `MULTI: ${type} ENTERED IN QUEUE`)
            db.pools
              // Run query
              .then((pool) => {
                return pool.request()
                  // Select game players
                  .input('player_role', 0)
                  .query('SELECT TOP 2 * FROM dbo.multiplayer_queue WHERE player_role = @player_role;')
              })
              .then(result => {
                console.log("selected")
                console.log(result)
                if (result.recordset.length > 0) {
                  playerOne = result.recordset[0].account_id
                }
                if (result.recordset.length > 1) {
                  playerTwo = result.recordset[1].account_id
                }
                if (result.recordset.length === 2) {
                  console.log("create game")
                  db.pools
                    // Run query
                    .then((pool) => {
                      return pool.request()
                        // Select game admins
                        .input('player_role', 1)
                        .query('SELECT TOP 1 * FROM dbo.multiplayer_queue JOIN dbo.admin_queue_words ON dbo.multiplayer_queue.account_id = dbo.admin_queue_words.account_id WHERE player_role = @player_role;')
                        .then(result => {
                          if (result.recordset.length === 1) {
                            console.log(result)
                            playerAdmin = result.recordset[0].account_id[0]
                            console.log(playerAdmin)
                            word = result.recordset[0].word
                            db.pools
                              // create in game
                              .then((pool) => {
                                console.log('attempt game creation')
                                return pool.request()
                                  // Select game admins
                                  .input('player_one', playerOne)
                                  .input('player_two', playerTwo)
                                  .input('player_admin', playerAdmin)
                                  .input('word', word)
                                  .query('INSERT INTO dbo.games (player_one, player_two, player_admin, word) VALUES (@player_one, @player_two, @player_admin, @word);')
                              })
                              .then(result => {
                                //delete people from queue and admin words
                                console.log('game created')
                                newAction(accountId, `MULTI: GAME CREATED FOR: ${playerOne} + ${playerTwo} WITH ${playerAdmin} AS ADMIN`)
                                db.pools
                                  // create in game
                                  .then((pool) => {
                                    return pool.request()
                                      // Select game admins
                                      .input('player_one', playerOne)
                                      .input('player_two', playerTwo)
                                      .input('player_admin', playerAdmin)
                                      .query('DELETE FROM dbo.multiplayer_queue WHERE account_id = @player_one OR account_id = @player_two OR account_id = @player_admin;')
                                  })
                                  .then(result => {
                                    console.log('Players removed from queue')
                                    newAction(accountId, `MULTI: ${playerOne} + ${playerTwo} WITH ${playerAdmin} AS ADMIN REMOVED FROM QUEUE`)
                                    if (playerAdmin !== 0) {
                                      db.pools
                                        // create in game
                                        .then((pool) => {
                                          return pool.request()
                                            .input('player_admin', playerAdmin)
                                            .query('DELETE FROM dbo.admin_queue_words WHERE account_id = @player_admin;')

                                        })
                                        .then(result => {
                                          console.log('word removed from word queue')
                                          newAction(accountId, `MULTI: ${word} REMOVED FROM QUEUE`)
                                          res.json('success!')
                                        })
                                    } else {
                                      res.json('success!')
                                    }

                                  })
                              })
                          } else {
                            playerAdmin = 0
                            const options = {
                              method: 'GET',
                              url: 'https://random-words5.p.rapidapi.com/getMultipleRandom',
                              params: { count: '1', wordLength: '5' },
                              headers: {
                                'x-rapidapi-host': 'random-words5.p.rapidapi.com',
                                'x-rapidapi-key': process.env.RAPID_API_KEY1
                              }
                            }
                            axios.request(options).then((response) => {
                              console.log(response.data)
                              word = (response.data[0])
                              db.pools
                                // Run query
                                .then((pool) => {
                                  return pool.request()
                                    // Select game admins
                                    .input('player_one', playerOne)
                                    .input('player_two', playerTwo)
                                    .input('player_admin', playerAdmin)
                                    .input('word', word)
                                    .query('INSERT INTO dbo.games (player_one, player_two, player_admin, word) VALUES (@player_one, @player_two, @player_admin, @word);')
                                })
                                .then(result => {
                                  //delete people from queue and admin words
                                  console.log('game created')
                                  newAction(accountId, `MULTI: GAME CREATED FOR: ${playerOne} & ${playerTwo} WITHOUT AN ADMIN`)
                                  db.pools
                                    // create in game
                                    .then((pool) => {
                                      return pool.request()
                                        // Select game admins
                                        .input('player_one', playerOne)
                                        .input('player_two', playerTwo)
                                        .input('player_admin', playerAdmin)
                                        .query('DELETE FROM dbo.multiplayer_queue WHERE account_id = @player_one OR account_id = @player_two OR account_id = @player_admin;')
                                    })
                                    .then(result => {
                                      console.log('Players removed from queue')
                                      newAction(accountId, `MULTI: GAME CREATED FOR: ${playerOne} & ${playerTwo} WITHOUT AN ADMIN`)
                                      if (playerAdmin !== 0) {
                                        db.pools
                                          // create in game
                                          .then((pool) => {
                                            return pool.request()
                                              .input('player_admin', playerAdmin)
                                              .query('DELETE FROM dbo.admin_queue_words WHERE account_id = @player_admin;')

                                          })
                                          .then(result => {
                                            console.log('word removed from word queue')
                                            res.json('success!')
                                          })
                                      } else {
                                        res.json('success!')
                                      }
                                    })
                                })
                            }).catch((error) => {
                              console.error(error)
                              return error
                            })
                          }
                        })
                    })
                } else {
                  //code for already in lobby
                  res.json('entered into db!')
                }
              })
          })
          // If there's an error, return that with some description
          .catch(err => {
            res.send({ Error: err })
          })
      } else {
        //code for already in lobby
      }
    })
    // If there's an error, return that with some description
    .catch(err => {
      res.send({ Error: err })
    })

})


////////////////////////////////////////////////////
//socket connection
////////////////////////////////////////////////////


io.on('connection', socket => {
  console.log('new WS connection')
  
  socket.on('game-created', (gameId, playerOne, playerTwo, adminId, word) => {
    let gameIdS = gameId
    let playerOneS = playerOne
    let playerTwoS = playerTwo
    let adminIdS = adminId
    let wordS = word
    socket.join(gameId)
    socket.broadcast.emit('send-game', gameIdS, playerOneS, playerTwoS, adminIdS, wordS)
  })

  socket.on('join-game-room', (gameId) => {
    socket.join(gameId)
  })

  socket.on('disconnect', () => {  
    console.log('Player disconnected')
   
  })

  ////////////////////////////////////////////////////
  //Multiplayer comms
  ////////////////////////////////////////////////////

  socket.on('player-word', (opponentGuess, currentRow, gameRole, gameId) => {
    console.log(`opponent guess received at ${currentRow}`)
    let gameRoleS = gameRole 
    socket.to(gameId).emit('player-word', opponentGuess, currentRow, gameRoleS)
  })

  socket.on('game-finish', (currentRow, gameId) => {
    let rowNum = currentRow
    socket.to(gameId).emit('opponent-finish', rowNum)
  })
})

module.exports = app