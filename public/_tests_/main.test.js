/* eslint-env jest*/
const calcScore  = require('../calcScore.js')
test('should validate score', () => {
    const text = calcScore(1, true)
    expect(text).toBe(10)
  })
  test('should validate score', () => {
    const text = calcScore(2, true)
    expect(text).toBe(5)
  })
  test('should validate score', () => {
    const text = calcScore(3, true)
    expect(text).toBe(4)
  })
  test('should validate score', () => {
    const text = calcScore(4, true)
    expect(text).toBe(3)
  })
  test('should validate score', () => {
    const text = calcScore(5, true)
    expect(text).toBe(2)
  })
  test('should validate score', () => {
    const text = calcScore(6, true)
    expect(text).toBe(1)
  })
  test('should validate score', () => {
    const text = calcScore(6, false)
    expect(text).toBe(0)
  })

