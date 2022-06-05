// Finds score received for game for leaderboard
function calcScore(currentRow) {
  let score = 7
  if (currentRow === 0) {
    score = 10
    return score
  }
  score = score - currentRow - 1
  return score
}
module.exports=calcScore;