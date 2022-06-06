/* eslint-env jest*/
const calcScore  = require('../functions/calc_score.js')
const addLetter = require('../functions/add_letter.js')
const checkGuess = require('../functions/check_guess.js')
const deleteLetter = require('../functions/delete_letter.js')
test('Check that score is 10 when first attempt is correct', () => {  
    const score = calcScore(0)
    expect(score).toBe(10)
})
test('Check that score is 5 when second attempt is correct', () => { 
    const score = calcScore(1)
    expect(score).toBe(5)
})
test('Check that score is 4 when third attempt is correct', () => { 
    const score = calcScore(2)
    expect(score).toBe(4)
})
test('Check that score is 3 when fourth attempt is correct', () => {
    const score = calcScore(3)
    expect(score).toBe(3)
})
  test('Check that score is 2 when fifth attempt is correct', () => {  
    const score = calcScore(4)
    expect(score).toBe(2)
})
test('Check that score is 1 when last attempt is correct', () => { 
    const score = calcScore(5)
    expect(score).toBe(1)
})
test('Check that score is 0 when last attempt is incorrect', () => {   
    const score = calcScore(6)
    expect(score).toBe(0)
})

test('Check that game ends when user guessed incorrectly 5 times', () => {   
    const game = checkGuess('shark', 'works',5)
    expect(game).toBe(true)
})

test('Check that game ends when user guessed correctly', () => {   
    const game = checkGuess('works', 'works',1)
    expect(game).toBe(true)
})

test('Check that countertile increases when letter is added to the row', () => {   
    const wordEntry = [
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', '']
    ]
    const count = addLetter(wordEntry,'l', 1, 0)
    expect(count).toBe(1) 
})

test('Check that countertile decreases when letter is delted from the row', () => {   
    const wordEntry = [
        ['l', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', ''],
        ['', '', '', '', '']
    ]
    const count = deleteLetter(wordEntry, 0, 1)
    expect(count).toBe(0) 
})
