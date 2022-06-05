/* eslint-env jest*/
const calcScore  = require('../functions/calcScore.js')

test('should validate score', () => {   // Check that score is 10 when first attempt is correct
    const score = calcScore(0)
    expect(score).toBe(10)
})
test('should validate score', () => { // Check that score is 5 when second attempt is correct
    const score = calcScore(1)
    expect(score).toBe(5)
})
test('should validate score', () => { // Check that score is 4 when third attempt is correct
    const score = calcScore(2)
    expect(score).toBe(4)
})
test('should validate score', () => {  // Check that score is 3 when fourth attempt is correct
    const score = calcScore(3)
    expect(score).toBe(3)
})
  test('should validate score', () => {  // Check that score is 2 when fifth attempt is correct
    const score = calcScore(4)
    expect(score).toBe(2)
})
test('should validate score', () => {  // Check that score is 1 when last attempt is correct
    const score = calcScore(5)
    expect(score).toBe(1)
})
test('should validate score', () => {   // Check that score is 0 when last attempt is incorrect
    const score = calcScore(6)
    expect(score).toBe(0)
})

