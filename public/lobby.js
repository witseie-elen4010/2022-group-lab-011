const message = document.querySelector('.message-container')

document.getElementById("to_multi").addEventListener("click", toMulti);
const playerType = document.getElementById("game_role").value
const adminWord = document.getElementById("admin_input").value
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
    if (playerType === 1) {
        validEntry = checkWord(adminWord)
        socket.emit('set-admin-word', adminWord)
    }
    if (validEntry) {
        const userInfo = [playerType, playerID]
        socket.emit('game-enter', userInfo)
        fetch('/to-multi')   
    }
}

function checkWord(word) {
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
    const messageElement = document.createElement('p')
    messageElement.textContent = msg
    message.append(messageElement)
    setTimeout(() => message.removeChild(messageElement), 2000)
}