const db = require('../dbconfig.js')

document.addEventListener('DOMContentLoaded', () => {
  /*init*/
  createBoardGrid()
  getNewWord()

  //let rightGuessString = WORDS[Math.floor(Math.random() * WORDS.length)]
  //console.log(rightGuessString)
  let word
  const numGuesses = [[]]
  let availableSpace = 1  
  let numGuessCount = 0
  let score = 7
  let answer = false
    
  /* the word might be very obscure so the console out of
  the word can be used to test
  
  the 5000 delay is to give enough time for the getNewWord() function to
  interact with the API*/

  async function asyncCall() {
    console.log('calling');
    const result = await getNewWord();
  }

  setTimeout(() => { console.log(`${word}`); }, 5000)

  const keys = document.querySelectorAll('.keyboard-row button')
  
  /*accessing API for a new random word
  
  The problem is that most of the words are obscure english words and/or names
  a condensed dictionary will have to be created*/

  function getNewWord() {
    var startTime = performance.now()
    fetch(
      `https://wordsapiv1.p.rapidapi.com/words/?random=true&lettersMin=5&lettersMax=5`,
      {
        method: "GET",
        headers: {
          "X-RapidAPI-Host": "wordsapiv1.p.rapidapi.com",
          "X-RapidAPI-Key": "02aa9418c4msh9e030e399f79480p15dd0bjsn17744f8ca659",
        },
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((res) => {
        word = res.word;
      })
      .catch((err) => {
        console.error(err);
      });
      var endTime = performance.now()
      console.log(`Call to doSomething took ${endTime - startTime} milliseconds`)
    
  }

  asyncCall()

  function getTileColour (letter, index) {
    const letterInWord = word.includes(letter)

    if (!letterInWord) {
      return 'rgb(50, 50, 50)'
    }
    const letterInPosition = word.charAt(index)
    const letterRightPosition = (letter === letterInPosition)

    if (letterRightPosition) {
      return 'rgb(50, 205, 50)'
    }

    if (!letterRightPosition) {
      return 'rgb(255,69,50)'
    }
  }

  function handleGuess () {
    const currentWordArr = getCurrentWordArr()
    if (currentWordArr.length !== 5) {
      window.alert('Word must be 5 letters.')
      return
    }
    const currentGuess = currentWordArr.join('')

    /* comparing the guessed word with all words on the Words API */

    fetch(
      `https://wordsapiv1.p.rapidapi.com/words/${currentGuess}`,
      {
        method: "GET",
        headers: {
          'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com',
          'X-RapidAPI-Key': '02aa9418c4msh9e030e399f79480p15dd0bjsn17744f8ca659',
        },
      } 
    ).then((res) => {
      if(!res.ok){
        throw Error()
      } 

      const firstLetterId = numGuessCount * 5 + 1
      const interval = 200
      currentWordArr.forEach((letter, index) => {
        setTimeout(() => {
          const tileColor = getTileColour(letter, index)
          const letterId = firstLetterId + index
          const letterEl = document.getElementById(letterId)
          letterEl.style = `background-color:${tileColor};color:${'rgb(230, 230, 230)'}`
        }, interval * index)
      })
  
      numGuessCount += 1

      if (currentGuess === word) {
        answer = true
        setTimeout(() => { window.alert(`Congratulations! Your score is: ${calcScore(numGuessCount,answer)}`);} , 1000) 
      }
      if (numGuesses.length === 6) {
        answer = false
        setTimeout(() => {window.alert(`Better Luck Next Time! The word is ${word}. Your score is: ${calcScore(numGuessCount,answer)}`);} , 1000) 
      }
      numGuesses.push([])

    }).catch(() => {
      window.alert("Word doesn't exist. Try again!")
    });
  }

  for (let i = 0; i < keys.length; i++) {
    keys[i].onclick = ({ target }) => {
      const letter = target.getAttribute('data-key')

      if (letter === 'del') {
        handleDeleteLetter()
        return
      }

      if (letter === 'enter') {
        handleGuess()
        return
      }
      updateGuesses(letter)
    }
  }

  function getCurrentWordArr () {
    const numberOfGuesses = numGuesses.length
    return numGuesses[numberOfGuesses - 1]
  }

  function updateGuesses (letter) {
    const currentWordArr = getCurrentWordArr()
    if (currentWordArr && currentWordArr.length < 5) {
      currentWordArr.push(letter)

      const availableSpaceEl = document.getElementById(String(availableSpace))

      availableSpace = availableSpace + 1
      availableSpaceEl.textContent = letter
    }
  }

  /* temp solution for the backspace problem, the whole 'availableSpace'
    needs to be refactored if time allows:
    three backspace conditions: 1) if word === 5 letters
                                2) if no letters in row
                                3) all other configs
  */
 
  function handleDeleteLetter() {
    const currentWordArr = getCurrentWordArr()
    const removedLetter = currentWordArr.pop()

    if (currentWordArr.length === 4){
      const removedLetter = currentWordArr.pop()
      numGuesses[numGuesses.length - 1] = currentWordArr
      const lastLetterEl = document.getElementById(String(availableSpace - 1))
      lastLetterEl.textContent = ""   
      availableSpace = availableSpace - 1   
      return
    }
    if(availableSpace%5 === 1){
      return
    }
    numGuesses[numGuesses.length - 1] = currentWordArr;

    const lastLetterEl = document.getElementById(String(availableSpace - 1));

    lastLetterEl.textContent = "";
    availableSpace = availableSpace - 1;
    //console.log(availableSpace)
  }

  function createBoardGrid () {
    const gameBoard = document.getElementById('board')

    for (let index = 0; index < 30; index++) {
      const square = document.createElement('div')
      square.classList.add('square')
      square.setAttribute('id', index + 1)
      gameBoard.appendChild(square)
    }
  }

/* scoring sytem is based on the amount of guesses a player takes to solve the puzzle.
1 guess:   10
2 guesses: 5
3 guesses: 4
4 guesses: 3
5 guesses: 2
6 guesses: 1
All wrong guesses: 0 
The calcScore() function is called in handleGuess()*/
  const calcScore = require('../calcScore')  
  /*function calcScore (numGuessCount,answer) {
    if (numGuessCount === 1) {
      let score = 10
      return score
    }
    if (answer === false){
      let score = 0
      return score
    }
    score = score - numGuessCount
    return score
  }*/
})

function updateDB (score) {
  // set variables
  //const account_id = req.session.ID
  const account_id = 1 // req and session is currently not defined due to the make up of the main.js file, will be changed, func not called yet
  const score = score
  // get username from accounts database
  db.pools
  .then((pool) => {
    return pool.request()
    .input('account_id', account_id)
    .query('select username FROM dbo.accounts where account_id = @account_id;')
  })
  .then(result => {
    const username = result.recordsets[0]['username']
    db.pools
    // Run query
    .then((pool) => {
      return pool.request()
        .input('account_id', account_id)
        .query('Select username from dbo.leaderboard where account_id = @account_id;') // check if user exists in DB        
    })
    .then(result => {
      if (result.recordset.length === 0) { 
        // insert new user into leaderboard
        db.pools
        // Run query
        .then((pool) => {
            // get data to input into leaderboard
            let game_count = 1
            let new_score = score
            let average_score = score/game_count
            // insert user into leaderboard
            return pool.request()
            .input('id', account_id)
            .input('account_id', account_id)
            .input('username', username)
            .input('game_count', game_count)
            .input('new_score', new_score)
            .input('average_score', average_score)
            .query('INSERT INTO dbo.leaderboard (id, account_id, username, game_count, new_score, average_score) VALUES (@id, @account_id, @username, @game_count, @new_score, @average_score);')
        })
      } else {
        // update user in leaderboard

        // get info from leaderboard to update
        db.pools
        .then((pool) => {
          return pool.request()
          .input('account_id', account_id)
          .query('select game_count, score FROM dbo.leaderboard where account_id = @account_id;')
        })
        .then(result => {
          let game_count = result.recordsets[0]['game_count']
          let old_score = result.recordsets[0]['score']
          game_count = game_count + 1
          let new_score = old_score + score
          const average_score = new_score/game_count 
          db.pools
          .then((pool) => {
            // info 
            return pool.request()
              .input('account_id', account_id)
              .input('username', username)
              .input('game_count', game_count)
              .input('new_score', new_score)
              .input('average_score', average_score)
              .query('UPDATE dbo.leaderboard SET (game_count = @game_count, score = @new_score, average_score = @average_score) WHERE (account_id = @account_id, username = @username);')
          })
        })
      }
    })
  })
}
