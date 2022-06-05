function checkGuess() {
    if (wordle == tempWord) {
        GameOver = true
        wordEntry.push(wordle)
        wordEntry.push(calcScore(currentRow))
        
    } else {
        if (currentRow >= 5) {
            GameOver = true
            showMessage('Game Over')
            wordEntry.push(wordle)
            wordEntry.push(0)
            fetch(`/game_end/?wordEntries=${wordEntry}`)
            return
                        }
                        if (currentRow < 5) {
                            currentRow++
                            currentTile = 0
                        }
                    }
                }
            }).catch(err => console.log(err))
    }
}