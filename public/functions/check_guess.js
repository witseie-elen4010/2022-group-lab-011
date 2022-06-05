function checkGuess( wordle,tempWord,currentRow) {
    let GameOver= false
    if (wordle === tempWord && currentRow < 6) {
        GameOver = true
    } else {
        if (currentRow >= 5) {
            GameOver = true
        }
    }
    return GameOver
}
module.exports=checkGuess