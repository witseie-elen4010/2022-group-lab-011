const socket = io()

let gameId
let gameRole
let accountId
let playerOne
let playerTwo
let adminId
let gameStart = false
let word = ''

//Create is waiting for oppenents sign

function getGame(){
fetch(`/userID`)
    .then(response => response.json())
    .then(json => {
        accountId = json
        fetch(`/getGame/?accountId=${accountId}`)
         .then(response => response.json())
         .then(json => {
            if (json === 'not in game')
            {
              console.log('not in game')
            } else {
              console.log('game found')
              console.log(json)
              gameId = json.recordset[0].id
              playerOne = json.recordset[0].player_one
              playerTwo = json.recordset[0].player_two
              adminId = json.recordset[0].player_admin
              word = json.recordset[0].word
              console.log(word)
              gameStart = true

              let opponentId
              if (accountId === playerOne ){
                gameRole  = 'playerOne'
                opponentId = playerTwo
             } else if (accountId === playerTwo){
                gameRole = 'playerTwo'
                opponentId = playerOne
             } else if (accountId === adminId){
                gameRole = 'admin'
             }
             let multiGameData = [gameId, accountId, opponentId, adminId, word]
             fetch(`/set-multi-log/?multiGameData=${multiGameData}`)
              .then(response => response.json())
              .then(json => {
                console.log(json)
                socket.emit('game-created', gameId, playerOne, playerTwo, adminId, word)
             })
              //send to other players that there is a game that has started
              
            }
        })

})

}

getGame()


socket.on('check-in-game', (gameIdS, playerOneS, playerTwoS, adminIdS, wordS) => {
    let isMyGame = false
    if (accountId === playerOneS){
        gameRole  = 'playerOne'
        isMyGame = true
    } else if (accountId === playerTwoS){
        gameRole = 'playerTwo'
        isMyGame = true
    } else if (accountId === adminIdS){
        gameRole = 'admin'
        isMyGame = true
    }

    if (isMyGame){
        gameId = gameIdS
        playerOne = playerOneS
        playerTwo = playerTwoS
        adminId = adminIdS
        word = wordS
        gameStart = true
        //call to game start

        console.log('multiplayer ready to start with ' + word + ' as ' + gameRole)    
    }

})


const tileBox = document.querySelector('.tile-container')
const opponentBox = document.querySelector('.opponent-container')
const keyboard = document.querySelector('.key-container')
const message = document.querySelector('.message-container')


// Setup of keys of keyboard
const keys = [
    'Q','W','E','R','T','Y','U','I','O','P','A','S','D','F','G','H','J','K','L','ENTER','Z','X','C','V','B','N','M','Del',
]

// Setup of area of empty values as placeholders for tiles
const wordEntry = [
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', '']
]

// Setup of global variables
let currentRow = 0

let currentTile = 0
let GameOver = false
let opponentGuess = []

//socket.emit('player-ready', Pid)
/*
socket.on('game-start', () => {
    let gameStart = true
})
*/
socket.on('player-word', opponentGuess => {
    flipTile2(opponentGuess)
})
/*
socket.on('game-over', () => {
    GameOver = true
} )
*/

// Create placeholders for entry words
wordEntry.forEach((guessRow, guessRowIndex) => {
    const rowElement = document.createElement('div')
    rowElement.setAttribute('id', 'guessRow-' + guessRowIndex)
    guessRow.forEach((_guess, guessIndex) => {
        const tileElement = document.createElement('div')
        tileElement.setAttribute('id', 'guessRow-' + guessRowIndex + '-tile-' + guessIndex)
        tileElement.classList.add('tile')
        rowElement.append(tileElement)
    })
    tileBox.append(rowElement)
})

// Create placeholders for entry words
wordEntry.forEach((guessRow, guessRowIndex) => {
    const rowElement = document.createElement('div')
    rowElement.setAttribute('id', 'showRow-' + guessRowIndex)
    guessRow.forEach((_guess, guessIndex) => {
        const tileElement = document.createElement('div')
        tileElement.setAttribute('id', 'showRow-' + guessRowIndex + '-tile-' + guessIndex)
        tileElement.classList.add('tile')
        rowElement.append(tileElement)
    })
    opponentBox.append(rowElement)
})


// Create keys for keyboard and add button listener
keys.forEach(key => {
    const buttonElement = document.createElement('button')
    buttonElement.textContent = key
    buttonElement.setAttribute('id', key)
    buttonElement.addEventListener('click', () => handleClick(key))
    keyboard.append(buttonElement)
})

// Handle events when a key is clicked
function handleClick(input) {
    console.log('Key was clicked...')
    if (!GameOver) {
        if (input === 'Del') {
            if (currentTile > 0) {
                deleteLetter()
            }
            return
        }
        if (input === 'ENTER') {
            checkGuess()
            return
        }
        else{
            if (currentTile < 5 && currentRow < 6){
                addLetter(input)
            }
        }     
    }
}

// Add a new letter on a tile
function addLetter(letter) {
    const tile = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile)
    tile.textContent = letter
    wordEntry[currentRow][currentTile] = letter
    tile.setAttribute('data', letter)
    currentTile++
}

// Remove a letter from a tile
function deleteLetter() {
    currentTile--
    const tile = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile)
    tile.textContent = ''
    wordEntry[currentRow][currentTile] = ''
    tile.setAttribute('data', '')
}

// Called when enter is clicked, verifies game progress ie. win/lose/continue
function checkGuess() {
    const tempWord = wordEntry[currentRow].join('')
    if (currentTile > 4) {
        fetch(`/check/?word=${tempWord}`)
            .then(response => response.json())
            .then(json => {
                if (json == 'Not valid') {
                    showMessage('Invalid word')
                    return
                } else {
                    flipTile()
                    socket.emit('player-word', opponentGuess)
                    if (wordle == tempWord) {
                        GameOver = true
                        showMessage('Correct!')
                        wordEntry.push(wordle)
                        wordEntry.push(calcScore(currentRow))
                        fetch(`/game_end/?wordEntries=${wordEntry}`)
                        return
                    } else {
                        if (currentRow >= 5) {
                            GameOver = true
                            showMessage('Game Over')
                            wordEntry.push(wordle)
                            wordEntry.push(0)
                            fetch(`/game_end/?wordEntries=${wordEntry}`)
                            return
                        }
                        if (currentRow < 5) {
                            currentRow++
                            currentTile = 0
                        }
                    }
                }
            }).catch(err => console.log(err))
    }
}

// Finds score received for game for leaderboard
function calcScore(currentRow) {
    let score = 7
    if (currentRow === 0) {
      score = 10
      return score
    }
    score = score - currentRow - 1
    return score
}

// Outputs message to client
function showMessage(msg) {
    const messageElement = document.createElement('p')
    messageElement.textContent = msg
    message.append(messageElement)
    setTimeout(() => message.removeChild(messageElement), 2000)
}

// Shows clients their correct letter guesses and positions  ie. green/yellow/dark
function addColorToKey(keyLetter, color) {
    const key = document.getElementById(keyLetter)
    key.classList.add(color)
}

// Flip the tile to show client the output of their guess
function flipTile() {
    const rowTiles = document.querySelector('#guessRow-' + currentRow).childNodes
    let checkWordle = wordle
    const guess = []
    opponentGuess = []

    rowTiles.forEach(tile => {
        guess.push({letter: tile.getAttribute('data'), color: 'grey-overlay'})
        opponentGuess.push({color: 'grey-overlay'})
    })

    guess.forEach((guess, index) => {
        if (guess.letter == wordle[index]) {
            guess.color = 'green-overlay'
            opponentGuess[index].color = 'green-overlay'
            checkWordle = checkWordle.replace(guess.letter, '')
        }
    })

    guess.forEach((guess, index) => {
        if (checkWordle.includes(guess.letter)) {
            guess.color = 'yellow-overlay'
            opponentGuess[index].color = 'yellow-overlay'
            checkWordle = checkWordle.replace(guess.letter, '')
        }
    })

    rowTiles.forEach((tile, index) => {
        setTimeout(() => {
            tile.classList.add('flip')
            tile.classList.add(guess[index].color)
            addColorToKey(guess[index].letter, guess[index].color)
        }, 500 * index)
    })
}

function flipTile2(opponentGuess) {
    const rowTiles = document.querySelector('#showRow-' + currentRow).childNodes

    rowTiles.forEach((tile, index) => {
        setTimeout(() => {
            tile.classList.add('flip')
            tile.classList.add(opponentGuess[index].color)
            //addColorToKey(opponentGuess[index].color)
        }, 500 * index)
    })
}