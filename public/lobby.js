const message = document.querySelector('.message-container')

const button = document.getElementById('to_multi')
button.addEventListener("click", () => toMulti())

let playerType
let adminWord
let playerID
let validEntry = true

////////////////////////////////////////////////////
//Multiplayer role selction and link to lobby
////////////////////////////////////////////////////

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
				} else {

					//valid word
					//place word in admin_queue_words                  
					fetch(`/game_admin_queue/?word=${adminWord}`)
						.then(response => response.json())
						.then(json => {
							console.log(json)
							//place player in multiplayer_queue
							fetch(`/game_player_queue/?playerType=${playerType}`)
								.then(response => response.json())
								.then(json => {
									console.log(json)
									window.location.replace('/wordle_multi')
								})

								.catch(err => console.log(err))
						})
						.catch(err => console.log(err))
				}
			}).catch(err => console.log(err))
	} else {
		//place player in multiplayer_queue
		fetch(`/game_player_queue/?playerType=${playerType}`)
			.then(response => response.json())
			.then(json => {
				console.log(json)
				window.location.replace('/wordle_multi')
			})
			.catch(err => console.log(err))
	}
}

////////////////////////////////////////////////////
//Displays
////////////////////////////////////////////////////

// Outputs message to client
function showMessage(msg) {
	console.log('in showMessage func')
	const messageElement = document.createElement('p')
	messageElement.textContent = msg
	message.append(messageElement)
	setTimeout(() => message.removeChild(messageElement), 5000)
}