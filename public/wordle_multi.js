const tileBox = document.querySelector('.tile-container')
const opponentBox = document.querySelector('.opponent-container')
const keyboard = document.querySelector('.key-container')
const message = document.querySelector('.message-container')
const myUsernameBox = document.querySelector('.userID-container')
const opponenetUsernameBox = document.querySelector('.opID-container')

const socket = io()

////////////////////////////////////////////////////
//Game init variables
////////////////////////////////////////////////////

// Setup of keys of keyboard
const keys = [
	'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Del',
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
let opponentRow = 0

let gameId
let gameRole
let accountId
let opponentId
let playerOne
let playerTwo
let adminId
let gameStart = false
let word = ''
let opponentNumGuesses = -1
let gameRunAlready = false

/////////////////////////////////////////////
// Interface setup
////////////////////////////////////////////

function gameSetupStart() {
	showMessage('Game started! You can begin guessing!')
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

	if (gameRole !== 'admin') {
	//Fetch usernames
	fetch(`/userName/?accountId=${accountId}`)
		.then(response => response.json())
		.then(json => {
			myUsernameMessage(json)
		})

	fetch(`/userName/?accountId=${opponentId}`)
		.then(response => response.json())
		.then(json => {
			opUsernameMessage(json)
		})
	} else {
		fetch(`/userName/?accountId=${playerOne}`)
		.then(response => response.json())
		.then(json => {
			myUsernameMessage(json)
		})

	fetch(`/userName/?accountId=${playerTwo}`)
		.then(response => response.json())
		.then(json => {
			opUsernameMessage(json)
		})
	}

	// Create keys for keyboard and add button listener
	if (gameRole !== 'admin') {
		keys.forEach(key => {
			const buttonElement = document.createElement('button')
			buttonElement.textContent = key
			buttonElement.setAttribute('id', key)
			buttonElement.addEventListener('click', () => handleClick(key))
			keyboard.append(buttonElement)
		})
	}
}

////////////////////////////////////////////////////
//Game creation
////////////////////////////////////////////////////

//check if player is in game or is still waiting
function getGame() {
	fetch(`/userID`)
		.then(response => response.json())
		.then(json => {
			accountId = json
			fetch(`/getGame/?accountId=${accountId}`)
				.then(response => response.json())
				.then(json => {
					if (json === 'not in game') {
						console.log('not in game, still waiting')
						showWaitMessage('Waiting for game to start...')
					} else {
						console.log('game found')
						console.log(json)
						gameId = json.recordset[0].id
						playerOne = json.recordset[0].player_one
						playerTwo = json.recordset[0].player_two
						adminId = json.recordset[0].player_admin
						word = json.recordset[0].word.toUpperCase()
						gameStart = true

						if (accountId === playerOne) {
							gameRole = 'playerOne'
							opponentId = playerTwo
						} else if (accountId === playerTwo) {
							gameRole = 'playerTwo'
							opponentId = playerOne
						} else if (accountId === adminId) {
							gameRole = 'admin'
						}

						let multiGameData = [gameId, accountId, opponentId, adminId, word]
						console.log(multiGameData)
						fetch(`/set-multi-log/?multiGameData=${multiGameData}`)
							.then(response => response.json())
							.then(json => {
								console.log(word)
								//console.log(gameId)

								//start game functionality
								if (gameRunAlready === false) {
									gameRunAlready = true
									gameSetupStart()
									socket.emit('game-created', gameId, playerOne, playerTwo, adminId, word)//creates room and sends to all players to see if they are in the game
								}

							})
						//send to other players that there is a game that has started

					}
				})

		})

}

////////////////////////////////////////////////////
//Socket functionality
////////////////////////////////////////////////////

socket.on('send-game', (gameIdS, playerOneS, playerTwoS, adminIdS, wordS) => {

	console.log('game-created')
	let isMyGame = false
	if (accountId === playerOneS) {
		gameRole = 'playerOne'
		opponentId = playerTwoS
		isMyGame = true
	} else if (accountId === playerTwoS) {
		gameRole = 'playerTwo'
		opponentId = playerOneS
		isMyGame = true
	} else if (accountId === adminIdS) {
		gameRole = 'admin'
		isMyGame = true
	}

	if (isMyGame) {
		socket.emit('join-game-room', gameIdS)
		gameId = gameIdS
		playerOne = playerOneS
		playerTwo = playerTwoS
		adminId = adminIdS
		word = wordS.toUpperCase()
		gameStart = true

	}
	//start game functionality
	if (gameRunAlready === false) {

		if (gameRole !== 'admin') {
			let multiGameData = [gameId, accountId, opponentId, adminId, word]
			fetch(`/set-multi-log/?multiGameData=${multiGameData}`)
				.then(response => response.json())
				.then(json => {
					console.log('entered into multi game logs')
				})
			
		}
		gameRunAlready = true;
		gameSetupStart()
		console.log('multiplayer ready to start with ' + word + ' as ' + gameRole)
	}

})

socket.on('player-word', (opponentGuess, row, gameRoleS) => {

	if (gameRole === 'admin') {
		if (gameRoleS === 'playerOne') {
			flipTile3(opponentGuess, row)
		} else {
			flipTile2(opponentGuess, row)
		}
	} else {
		flipTile2(opponentGuess, row)
	}
})

socket.on('opponent-finish', (rowNum) => {
	opponentNumGuesses = rowNum
	//setTimeout(() => window.location.replace('/lobby'), 5000)

})

getGame()

////////////////////////////////////////////////////
//Handle events
////////////////////////////////////////////////////

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
		else {
			if (currentTile < 5 && currentRow < 6) {
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
	let winner = 'Won' // default win
	const tempWord = wordEntry[currentRow].join('')
	if (currentTile > 4) {
		fetch(`/check/?word=${tempWord}`)
			.then(response => response.json())
			.then(json => {
				if (json === 'Entry word not found') {
					showMessage('Invalid word')
					return
				} else {
					flipTile()
					socket.emit('player-word', opponentGuess, currentRow, gameRole, gameId)
					if (word == tempWord) {
						let data1 = [tempWord, gameId, currentRow + 1]
						fetch(`/enter-multi-word/?data=${data1}`)
							.then(response => response.json())
							.then(json => {
								console.log(json)
							})
						GameOver = true
						showMessage(`Correct! Go check Game ${gameId} in the Game Log!`)
						wordEntry.push(word)
						wordEntry.push(calcScore(currentRow))
						console.log('___________________')
						console.log('player' + currentRow)
						console.log(opponentNumGuesses)
						if (opponentNumGuesses !== -1) {
							if (currentRow > opponentNumGuesses) {
								winner = 'Lost'
							} else if (currentRow === opponentNumGuesses) {
								winner = 'Draw'
							}
							let data3 = [winner, accountId, opponentId]
							fetch(`/enter-multi-leaderboard/?data=${data3}`)
								.then(response => response.json())
								.then(json => {
									console.log(json)
								})
						}
						let data = [winner, gameId]
						console.log(winner)
						fetch(`/enter-multi-winner/?data=${data}`)
							.then(response => response.json())
							.then(json => {
								console.log(json)
							})
						socket.emit('game-finish', currentRow, gameId)
						//setTimeout(() => window.location.replace('/lobby'), 5000)
						return
					} else {
						let data = [tempWord, gameId, currentRow + 1]
						fetch(`/enter-multi-word/?data=${data}`)
							.then(response => response.json())
							.then(json => {
								console.log(json)
							})
						if (currentRow >= 5) {
							GameOver = true
							showMessage(`Game Over! The correct word was ${word}!`)
							let data = ['Lost', gameId]
							fetch(`/enter-multi-winner/?data=${data}`)
								.then(response => response.json())
								.then(json => {
									console.log(json)
								})
							return
						}
						if (currentRow < 5) {
							currentRow++
							currentTile = 0
							//console.log(`before socket ${currentRow}`)

						}
					}
				}
			}).catch(err => console.log(err))
	}
}

// Shows clients their correct letter guesses and positions  ie. green/yellow/dark
function addColorToKey(keyLetter, color) {
	const key = document.getElementById(keyLetter)
	key.classList.add(color)
}

// Flip the tile to show client the output of their guess
function flipTile() {
	const rowTiles = document.querySelector('#guessRow-' + currentRow).childNodes
	let checkWordle = word
	const guess = []
	opponentGuess = []
	console.log(`currentRow = ${currentRow}`)

	rowTiles.forEach(tile => {
		guess.push({ letter: tile.getAttribute('data'), color: 'grey-overlay' })
		opponentGuess.push({ letter: tile.getAttribute('data'), color: 'grey-overlay' })
	})

	guess.forEach((guess, index) => {
		if (guess.letter == word[index]) {
			guess.color = 'green-overlay'
			opponentGuess[index].color = 'green-overlay'
			checkWordle = checkWordle.replace(guess.letter, '')
		}
	})

	guess.forEach((guess, index) => {
		if ((checkWordle.includes(guess.letter)) && (guess.color != 'green-overlay')) {
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

function flipTile2(opponentGuess, row) {
	opponentRow = row
	const rowTiles = document.querySelector('#showRow-' + opponentRow).childNodes

	rowTiles.forEach((tile, index) => {
		setTimeout(() => {
			tile.classList.add('flip')
			if (gameRole === 'admin') {
				tile.textContent = opponentGuess[index].letter
				tile.setAttribute('data', opponentGuess[index].letter)
			}
			//console.log(opponentGuess[index].letter)
			tile.classList.add(opponentGuess[index].color)
			//addColorToKey(/guess[index].letter,/opponentGuess[index].color)
		}, 500 * index)
	})
}

function flipTile3(guess, row) {
	opponentRow = row
	const rowTiles = document.querySelector('#guessRow-' + opponentRow).childNodes
	let checkWordle = word
	console.log(`currentRow = ${currentRow}`)

	guess.forEach((guess, index) => {
		if (guess.letter == word[index]) {
			guess.color = 'green-overlay'
			checkWordle = checkWordle.replace(guess.letter, '')
		}
	})

	guess.forEach((guess, index) => {
		if ((checkWordle.includes(guess.letter)) && (guess.color != 'green-overlay')) {
			guess.color = 'yellow-overlay'
			checkWordle = checkWordle.replace(guess.letter, '')
		}
	})

	rowTiles.forEach((tile, index) => {
		setTimeout(() => {
			tile.textContent = guess[index].letter
			tile.setAttribute('data', guess[index].letter)
			tile.classList.add('flip')
			tile.classList.add(guess[index].color)
		}, 500 * index)
	})
}

////////////////////////////////////////////////////
//Game end
////////////////////////////////////////////////////

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

////////////////////////////////////////////////////
//Displays
////////////////////////////////////////////////////

// Outputs message to client
function showMessage(msg) {
	const messageElement = document.createElement('p')
	messageElement.textContent = msg
	message.append(messageElement)
	setTimeout(() => message.removeChild(messageElement), 2000)
}

function showWaitMessage(msg) {
	const messageElement = document.createElement('p')
	messageElement.textContent = msg
	message.append(messageElement)
	setTimeout(() => message.removeChild(messageElement), 10000)
}

function myUsernameMessage(msg) {
	const messageElement = document.createElement('p')
	messageElement.textContent = msg
	myUsernameBox.append(messageElement)
}

function opUsernameMessage(msg) {
	const messageElement = document.createElement('p')
	messageElement.textContent = msg
	opponenetUsernameBox.append(messageElement)
}