function deleteLetter(wordEntry,currentRow,currentTile) {
    wordEntry[currentRow][currentTile] = ''
    return --currentTile
    
}
module.exports=deleteLetter