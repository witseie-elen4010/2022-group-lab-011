function validateJS () {
  const username = document.getElementById('username').value
  const password = document.getElementById('password').value
  if (username === 'admin' && password === 'admin') {
    alert('You have succesfully logged in!')
  } else {
    alert('Incorrect username/password!')
  }
}
