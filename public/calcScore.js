function calcScore(numGuessCount,answer){
  let score = 7  
  if (numGuessCount === 1) {
      let score = 10
      return score
    }
    if (answer === false){
      let score = 0
      return score
    }
    score = score - numGuessCount
    return score
  }
  module.exports=calcScore