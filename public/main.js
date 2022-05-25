document.addEventListener('DOMContentLoaded', () => {
  /*init*/
  createBoardGrid()
  getNewWord()

  let word
  const numGuesses = [[]]
  let availableSpace = 1  
  let numGuessCount = 0

  /* the word might be very obscure so the console out of
  the word can be used to test
  
  the 5000 delay is to give enough time for the getNewWord() function to
  interact with the API*/

  async function asyncCall() {
    console.log('calling');
    const result = await getNewWord();
    //console.log(`${word}`);
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
        setTimeout(() => { window.alert('congratulations');} , 1000) 
      }
      if (numGuesses.length === 6) {
        window.alert(`Better Luck Next Time! The word is ${word}.`)
      }
      numGuesses.push([])

    }).catch(() => {
      window.alert("word is not recognised")
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
    console.log(availableSpace)
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
