function addLetter(letter) {
    const tile = //document.getElementById('guessRow-' + currentRow + '-tile-' + currentTile)
    tile.textContent = letter
    wordEntry[currentRow][currentTile] = letter
    tile.setAttribute('data', letter)
    currentTile++
}
module.exports=addLetter