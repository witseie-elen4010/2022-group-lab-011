function validateJS () {
  const username = document.getElementById('username').value
  const password = document.getElementById('password').value
  if (username === 'admin' && password === 'admin') {
    alert('You have succesfully logged in!')
  } else {
    alert('Incorrect username/password!')
  }
}

exports.toHome = (username, password) => {
  let msg
  if (username === 'admin' && password === 'admin') {
    msg = 'Go to Home' // this would be a link to the home page
  } else {
    msg = 'Do not go to Home'
  }
  return msg
}
