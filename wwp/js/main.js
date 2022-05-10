// Initial rendition of the game logic.
// Event listener for inputs.
document.addEventListener('DOMContentLoaded', () => {
  // setup of squares.
  createSquares()

  // keyboard keys init.
  const keys = document.querySelectorAll('.keyboard-row button')
  const guessedWords = [[]]
  let availableSpace = 1

  // keys will update on click - for now Enter and Del need to be added in.
  for (let i = 0; i < keys.length; i++) {
    keys[i].onclick = ({ target }) => {
      const letter = target.getAttribute('data-key')

      updateGuessedWords(letter)
    }
  }
  // Array for guessed words. Currently a placeholder.
  function getCurrentWordArr () {
    const numberOfGuessedWords = guessedWords.length
    return guessedWords[numberOfGuessedWords - 1]
  }

  // The function for tracking and updating guessed words. Shows the input letter on screen when clicked, but doesn't register a word yet.
  function updateGuessedWords (letter) {
    const currentWordArr = getCurrentWordArr()

    if (currentWordArr && currentWordArr.length < 5) {
      currentWordArr.push(letter)

      const availableSpaceEl = document.getElementById(String(availableSpace))

      availableSpace = availableSpace + 1
      availableSpaceEl.textContent = letter
    }
  }
  // Function for creating squares.
  function createSquares () {
    const gameBoard = document.getElementById('board')

    for (let index = 0; index < 30; index++) {
      const square = document.createElement('div')
      square.classList.add('square')
      square.setAttribute('id', index + 1)
      gameBoard.appendChild(square)
    }
  }
})
