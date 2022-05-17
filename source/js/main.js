document.addEventListener('DOMContentLoaded', () => {
  createBoardGrid()

  const keys = document.querySelectorAll('.keyboard-row button')
  const numGuesses = [[]]
  let availableSpace = 1

  const word = 'grape'
  let numGuessCount = 0

  function getTileColor (letter, index) {
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
    }
    const currentGuess = currentWordArr.join('')

    const firstLetterId = numGuessCount * 5 + 1
    const interval = 500
    currentWordArr.forEach((letter, index) => {
      setTimeout(() => {
        const tileColor = getTileColor(letter, index)
        const letterId = firstLetterId + index
        const letterEl = document.getElementById(letterId)
        letterEl.style = `background-color:${tileColor};color:${'rgb(230, 230, 230)'}`
      }, interval * index)
    })

    numGuessCount += 1

    if (currentGuess === word) {
      window.alert('congratulations')
    }
    if (numGuesses.length === 6) {
      window.alert(`Better Luck Next Time! The word is ${word}.`)
    }
    numGuesses.push([])
  }

  for (let i = 0; i < keys.length; i++) {
    keys[i].onclick = ({ target }) => {
      const letter = target.getAttribute('data-key')

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

  function createBoardGrid () {
    const gameBoard = document.getElementById('board')

    for (let index = 0; index < 30; index++) {
      const square = document.createElement('div')
      square.classList.add('square')
      square.setAttribute('id', index + 1)
      gameBoard.appendChild(square)
    }
  }
})