const loginForm = document.getElementById('loginForm')
const createForm = document.getElementById('createForm')
const loginEmailInput = document.getElementById('loginEmail')
const loginPasswordInput = document.getElementById('loginPassword')
const createEmailInput = document.getElementById('createEmail')
const createPasswordInput = document.getElementById('createPassword')
const showLoginButton = document.getElementById('showLoginButton')
const showCreateButton = document.getElementById('showCreateButton')
const message = document.getElementById('message')
const storageKey = 'juiceShopUsers'

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

// this gets saved users from local storage
function getSavedUsers() {
  const savedUsers = localStorage.getItem(storageKey)

  if (!savedUsers) {
    return []
  }

  return JSON.parse(savedUsers)
}

// this saves users in local storage
function saveUsers(users) {
  localStorage.setItem(storageKey, JSON.stringify(users))
}

// this sends data to the server so the backend can validate too
async function validateWithServer(email, password) {
  const response = await fetch('/api/validate-user', {
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

  return {
    ok: response.ok,
    message: data.message
  }
}

// this shows the login form and hides the create form
function showLoginView() {
  loginForm.classList.remove('hidden-form')
  createForm.classList.add('hidden-form')
  showLoginButton.classList.add('active-tab')
  showCreateButton.classList.remove('active-tab')
  showMessage('', false)
}

// this shows the create form and hides the login form
function showCreateView() {
  createForm.classList.remove('hidden-form')
  loginForm.classList.add('hidden-form')
  showCreateButton.classList.add('active-tab')
  showLoginButton.classList.remove('active-tab')
  showMessage('', false)
}

// this creates an account and saves it in local storage
async function submitCreateAccount(event) {
  event.preventDefault()

  const email = createEmailInput.value.trim()
  const password = createPasswordInput.value.trim()
  const validationError = validateClientInput(email, password)

  if (validationError !== '') {
    showMessage(validationError, false)
    return
  }

  try {
    const serverResult = await validateWithServer(email, password)

    if (!serverResult.ok) {
      showMessage(serverResult.message, false)
      return
    }

    const users = getSavedUsers()
    const existingUser = users.find(function(user) {
      return user.email.toLowerCase() === email.toLowerCase()
    })

    if (existingUser) {
      showMessage('account already exists for this email', false)
      return
    }

    users.push({
      email: email,
      password: password
    })

    saveUsers(users)
    createForm.reset()
    showMessage('account created and saved in local storage', true)
    showLoginView()
    loginEmailInput.value = email
  }
  catch (error) {
    showMessage('could not connect to the server', false)
  }
}

// this checks login data against local storage after validation
async function submitLogin(event) {
  event.preventDefault()

  const email = loginEmailInput.value.trim()
  const password = loginPasswordInput.value.trim()
  const validationError = validateClientInput(email, password)

  if (validationError !== '') {
    showMessage(validationError, false)
    return
  }

  try {
    const serverResult = await validateWithServer(email, password)

    if (!serverResult.ok) {
      showMessage(serverResult.message, false)
      return
    }

    const users = getSavedUsers()
    const matchedUser = users.find(function(user) {
      return user.email.toLowerCase() === email.toLowerCase() && user.password === password
    })

    if (!matchedUser) {
      showMessage('no saved account matches this email and password', false)
      return
    }

    showMessage('login successful with client side and server side validation', true)
    loginForm.reset()
  }
  catch (error) {
    showMessage('could not connect to the server', false)
  }
}

showLoginButton.addEventListener('click', showLoginView)
showCreateButton.addEventListener('click', showCreateView)
createForm.addEventListener('submit', submitCreateAccount)
loginForm.addEventListener('submit', submitLogin)
