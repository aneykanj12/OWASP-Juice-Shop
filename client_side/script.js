const loginForm = document.getElementById('loginForm')
const emailInput = document.getElementById('email')
const passwordInput = document.getElementById('password')
const message = document.getElementById('message')

// this checks the inputs before sending them to the server
function validateClientInput(email, password) {
  if (email === '' || password === '') {
    return 'email and password cannot be empty'
  }

  if (!email.includes('@')) {
    return 'email must contain @'
  }

  if (password.length < 8) {
    return 'password must be at least 8 characters long'
  }

  return ''
}

// this shows a message on the page
function showMessage(text, isSuccess) {
  message.textContent = text

  if (isSuccess) {
    message.style.color = 'green'
  }
  else {
    message.style.color = 'red'
  }
}

// this sends the login data to the server after client checks pass
async function submitLogin(event) {
  event.preventDefault()

  const email = emailInput.value.trim()
  const password = passwordInput.value.trim()
  const validationError = validateClientInput(email, password)

  if (validationError !== '') {
    showMessage(validationError, false)
    return
  }

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    })

    const data = await response.json()

    if (response.ok) {
      showMessage(data.message, true)
    }
    else {
      showMessage(data.message, false)
    }
  }
  catch (error) {
    showMessage('could not connect to the server', false)
  }
}

loginForm.addEventListener('submit', submitLogin)
