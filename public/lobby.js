document.addEventListener('DOMContentLoaded', () => {

    const socket = io()
    socket.emit('in-lobby')
    
})