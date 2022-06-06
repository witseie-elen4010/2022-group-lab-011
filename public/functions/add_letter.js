function addLetter(wordEntry,letter,currentRow, currentTile) {
    
    wordEntry[currentRow][currentTile] = letter
    return ++currentTile
}
module.exports = addLetter
