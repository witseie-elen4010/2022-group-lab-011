const tileBox = document.querySelector('.tile-container')
const keyboard = document.querySelector('.key-container')
const message = document.querySelector('.message-container')

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

////////////////////////////////////////////////////
//Board creation
////////////////////////////////////////////////////

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

// Create keys for keyboard and add button listener
keys.forEach(key => {
	const buttonElement = document.createElement('button')
	buttonElement.textContent = key
	buttonElement.setAttribute('id', key)
	buttonElement.addEventListener('click', () => handleClick(key))
	keyboard.append(buttonElement)
})

////////////////////////////////////////////////////
//Handle events
////////////////////////////////////////////////////

// Get word from server side
function setWord() {
	fetch('/word')
		.then(response => response.json())
		.then(json => {
			wordle = json.toUpperCase()
		})
		.catch(err => console.log(err))
}
setWord()

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
	const tempWord = wordEntry[currentRow].join('')
	if (currentTile > 4) {
		fetch(`/check/?word=${tempWord}`)
			.then(response => response.json())
			.then(json => {
				if (json == 'Entry word not found') {
					showMessage('Invalid word')
					return
				} else {
					flipTile()
					LogAction(tempWord)
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
							showMessage(`Game Over! ${wordle} was the correct word!`)
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

	rowTiles.forEach(tile => {
		guess.push({ letter: tile.getAttribute('data'), color: 'grey-overlay' })
	})

	guess.forEach((guess, index) => {
		if (guess.letter === wordle[index]) {
			guess.color = 'green-overlay'
			checkWordle = checkWordle.replace(guess.letter, '')
		}
	})

	guess.forEach(guess => {
		if ((checkWordle.includes(guess.letter)) && (guess.color != 'green-overlay')) {
			guess.color = 'yellow-overlay'
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

function LogAction(word) {
	let action_data = 'SOLO WORD GUESS: ' + word
	console.log(action_data)
	fetch(`/log-guess-solo/?data=${action_data}`)
		.then(response => response.json())
		.catch(err => console.log(err))
}

