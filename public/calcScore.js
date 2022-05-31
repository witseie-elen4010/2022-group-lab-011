function calcScore(numGuessCount,answer){
  //let numGuessCount = 1
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