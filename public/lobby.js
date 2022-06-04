const message = document.querySelector('.message-container')

const button = document.getElementById('to_multi')
button.addEventListener("click", () => toMulti())

let playerType 
let adminWord 
let playerID
let validEntry = true

fetch('/userID')
        .then(response => response.json())
        .then(json => {
            playerID = json
        })
        .catch(err => console.log(err))


const socket = io()
socket.emit('in-lobby')

function toMulti() {
    playerType = document.getElementById("game_role").value
    adminWord = document.getElementById("admin_input").value
    console.log('in to multi func')
    if (playerType === 1) {
        console.log('in admin func')
        validEntry = checkWord(adminWord)
        socket.emit('set-admin-word', adminWord)
    }
    if (validEntry) {
        console.log('in player func')
        const userInfo = [playerType, playerID]
        socket.emit('game-enter', userInfo)
        fetch('/to-multi')   
    }
}

function checkWord(word) {
    console.log('in checkWord func')
    fetch(`/check/?word=${word}`)
        .then(response => response.json())
        .then(json => {
            if (json == 'Entry word not found') {
                showMessage('Invalid word')
                return false
            } else {
                return true
            }
        }).catch(err => console.log(err))
}

// Outputs message to client
function showMessage(msg) {
    console.log('in showMessage func')
    const messageElement = document.createElement('p')
    messageElement.textContent = msg
    message.append(messageElement)
    setTimeout(() => message.removeChild(messageElement), 2000)
}