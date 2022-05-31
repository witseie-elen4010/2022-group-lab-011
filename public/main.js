//init varaiables
let word
const numGuesses = [[]]
let availableSpace = 1
let numGuessCount = 0
let score = 7
let answer = false
const keys = document.querySelectorAll('.keyboard-row button')
getNewWord()

//console of selected word
setTimeout(() => { console.log(`${word}`); }, 5000)

// new word from API
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

//tile colour function
function getTileColour(letter, index) {
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

// main guess handler
function handleGuess() {
  const currentWordArr = getCurrentWordArr()
  if (currentWordArr.length !== 5) {
    window.alert('Word must be 5 letters.')
    return
  }
  const currentGuess = currentWordArr.join('')
  console.log(currentWordArr)

  // check word
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
    if (!res.ok) {
      throw Error()
    }

    //update tile colours
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
      setTimeout(() => { window.alert(`Congratulations! Your score is: ${calcScore(numGuessCount, answer)}`); }, 1000)
    }
    if (numGuesses.length === 6) {
      answer = false
      setTimeout(() => { window.alert(`Better Luck Next Time! The word is ${word}. Your score is: ${calcScore(numGuessCount, answer)}`); }, 1000)
    }
    numGuesses.push([])

  }).catch(() => {
    window.alert("Word doesn't exist. Try again!")
  });
}

// get word array
function getCurrentWordArr() {
  const numberOfGuesses = numGuesses.length
  return numGuesses[numberOfGuesses - 1]
}

//add letters to grid
function updateGuesses(letter) {
  const currentWordArr = getCurrentWordArr()
  if (currentWordArr && currentWordArr.length < 5) {
    currentWordArr.push(letter)

    const availableSpaceEl = document.getElementById(String(availableSpace))

    availableSpace = availableSpace + 1
    availableSpaceEl.textContent = letter
    console.log(availableSpace)
  }
}

//remove letters from grid
function handleDeleteLetter() {
  const currentWordArr = getCurrentWordArr()
  const removedLetter = currentWordArr.pop()

  if (currentWordArr.length === 4) {
    const removedLetter = currentWordArr.pop()
    numGuesses[numGuesses.length - 1] = currentWordArr
    const lastLetterEl = document.getElementById(String(availableSpace - 1))
    lastLetterEl.textContent = ""
    availableSpace = availableSpace - 1
    return
  }
  if (availableSpace % 5 === 1) {
    return
  }
  numGuesses[numGuesses.length - 1] = currentWordArr;

  const lastLetterEl = document.getElementById(String(availableSpace - 1));

  lastLetterEl.textContent = "";
  availableSpace = availableSpace - 1;
}
//new listener
document.querySelectorAll('.keyboard-row button').forEach(item => {
  item.addEventListener('click', e => {
    //console.log(e.target)
    for (let i = 0; i < keys.length; i++) {
      keys[i].onclick = ({ target }) => {
        const letter = target.getAttribute('data-key')
        console.log(letter)
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
})
})

//score calculation
function calcScore() {
  if (numGuessCount === 1) {
    let score = 10
    return score
  }
  if (answer === false) {
    let score = 0
    return score
  }
  score = score - numGuessCount
  return score
}


