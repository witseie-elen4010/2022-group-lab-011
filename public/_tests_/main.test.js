/* eslint-env jest*/
const {calcScore}  = require('../calcScore')
test('should validate score', () => {
    const text = calcScore(1,false)
    expect(text).toBe(10)
  })