/* eslint-env jest*/
const calcScore  = require('../functions.js')
test('should validate score', () => {   // Check that score is 10 when first attempt is correct
    const text = calcScore(1, true)
    expect(text).toBe(10)
  })
  test('should validate score', () => { // Check that score is 5 when second attempt is correct
    const text = calcScore(2, true)
    expect(text).toBe(5)
  })
  test('should validate score', () => { // Check that score is 4 when third attempt is correct
    const text = calcScore(3, true)
    expect(text).toBe(4)
  })
  test('should validate score', () => {  // Check that score is 3 when fourth attempt is correct
    const text = calcScore(4, true)
    expect(text).toBe(3)
  })
  test('should validate score', () => {  // Check that score is 2 when fifth attempt is correct
    const text = calcScore(5, true)
    expect(text).toBe(2)
  })
  test('should validate score', () => {  // Check that score is 1 when last attempt is correct
    const text = calcScore(6, true)
    expect(text).toBe(1)
  })
  test('should validate score', () => {   // Check that score is 0 when last attempt is incorrect
    const text = calcScore(6, false)
    expect(text).toBe(0)
  })

