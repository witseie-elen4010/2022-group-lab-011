const tileDisplay = document.querySelector('.tile-container')
const keyboard = document.querySelector('.key-container')
const messageDisplay = document.querySelector('.message-container')

//setup
const keys = [
    'Q',
    'W',
    'E',
    'R',
    'T',
    'Y',
    'U',
    'I',
    'O',
    'P',
    'A',
    'S',
    'D',
    'F',
    'G',
    'H',
    'J',
    'K',
    'L',
    'ENTER',
    'Z',
    'X',
    'C',
    'V',
    'B',
    'N',
    'M',
    'Del',
]

const wordEntry = [
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', '']
]

let currentRow = 0
let currentTile = 0
let isGameOver = false

//create placeholders for entry words
wordEntry.forEach((guessRow, guessRowIndex) => {
    const rowElement = document.createElement('div')
    rowElement.setAttribute('id', 'guessRow-' + guessRowIndex)
    guessRow.forEach((_guess, guessIndex) => {
        const tileElement = document.createElement('div')
        tileElement.setAttribute('id', 'guessRow-' + guessRowIndex + '-tile-' + guessIndex)
        tileElement.classList.add('tile')
        rowElement.append(tileElement)
    })
    tileDisplay.append(rowElement)
})

//create keys for keyboard
keys.forEach(key => {
    const buttonElement = document.createElement('button')
    buttonElement.textContent = key
    buttonElement.setAttribute('id', key)
    buttonElement.addEventListener('click', () => handleClick(key))
    keyboard.append(buttonElement)
})

//get word
const setWord = () => {
    fetch('/word')
        .then(response => response.json())
        .then(json => {
            wordle = json.toUpperCase()
        })
        .catch(err => console.log(err))
}
setWord()

//Input handling
const handleClick = (input) => {
    if (!isGameOver) {
        if (input === 'Del') {
            if (currentTile > 0) {
                deleteLetter()
            }
            return
        }
        if (input === 'ENTER') {
            checkRow()
            return
        }
        else{
            if (currentTile < 5 && currentRow < 6){
                addLetter(input)
            }
        }     
    }
}

function addLetter(letter){
    const tile = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile)
    tile.textContent = letter
    wordEntry[currentRow][currentTile] = letter
    tile.setAttribute('data', letter)
    currentTile++
}

function deleteLetter(letter){
    currentTile--
    const tile = document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile)
    tile.textContent = ''
    wordEntry[currentRow][currentTile] = ''
    tile.setAttribute('data', '')
}

function checkRow(){
    const tempWord = wordEntry[currentRow].join('')
    if (currentTile > 4) {
        fetch(`/check/?word=${tempWord}`)
            .then(response => response.json())
            .then(json => {
                if (json == 'Entry word not found') {
                    showMessage('word not in list')
                    return
                } else {
                    flipTile()
                    if (wordle == tempWord) {
                        showMessage('Magnificent!')
                        fetch(`/game_end/?wordEntries=${wordEntry}`)
                        isGameOver = true
                        return
                    } else {
                        if (currentRow >= 5) {
                            isGameOver = true
                            showMessage('Game Over')
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

const showMessage = (message) => {
    const messageElement = document.createElement('p')
    messageElement.textContent = message
    messageDisplay.append(messageElement)
    setTimeout(() => messageDisplay.removeChild(messageElement), 2000)
}

const addColorToKey = (keyLetter, color) => {
    const key = document.getElementById(keyLetter)
    key.classList.add(color)
}

const flipTile = () => {
    const rowTiles = document.querySelector('#guessRow-' + currentRow).childNodes
    let checkWordle = wordle
    const guess = []

    rowTiles.forEach(tile => {
        guess.push({letter: tile.getAttribute('data'), color: 'grey-overlay'})
    })

    guess.forEach((guess, index) => {
        if (guess.letter == wordle[index]) {
            guess.color = 'green-overlay'
            checkWordle = checkWordle.replace(guess.letter, '')
        }
    })

    guess.forEach(guess => {
        if (checkWordle.includes(guess.letter)) {
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