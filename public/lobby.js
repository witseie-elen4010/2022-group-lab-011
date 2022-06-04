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
    console.log(adminWord)
    console.log(playerType)
    if (playerType === '1') {
        fetch(`/check/?word=${adminWord}`)
            .then(response => response.json())
            .then(json => {
                if (json === 'Entry word not found' || adminWord.length != 5) {
                    showMessage('Invalid word')
                    validEntry = false
                } else {
                    validEntry = true
                    socket.emit('set-word', adminWord)
                }
            }).catch(err => console.log(err))
    }
    if (validEntry) {
        //const userInfo = [playerType, playerID]
        //socket.emit('game-enter', playerType, playerID)
        socket.emit('enter', playerType, playerID)
        window.location.replace('/wordle_multi')
    }
}

// Outputs message to client
function showMessage(msg) {
    console.log('in showMessage func')
    const messageElement = document.createElement('p')
    messageElement.textContent = msg
    message.append(messageElement)
    setTimeout(() => message.removeChild(messageElement), 5000)
}