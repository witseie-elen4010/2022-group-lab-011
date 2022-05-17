function validate_entries () {
  const username = document.getElementById('username').value
  const password = document.getElementById('password').value
  const confirm_password = document.getElementById('confirm_password').value
  const email = document.getElementById('email').value
  if (username.length <= 0 || password.length <= 0 || confirm_password.length <= 0 || email.length <= 0) {
    alert('Enter all fields')
  } else {
    if (password === confirm_password && password.length > 0) {
      alert('Registration successful')
    } else {
      alert('Registration failed')
    }
  }
}
