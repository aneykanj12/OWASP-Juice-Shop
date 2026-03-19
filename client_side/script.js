const loginTab = document.getElementById('loginTab')
const createTab = document.getElementById('createTab')
const loginView = document.getElementById('loginView')
const createView = document.getElementById('createView')
const loginForm = document.getElementById('loginForm')
const createForm = document.getElementById('createForm')
const loginEmailInput = document.getElementById('loginEmail')
const loginPasswordInput = document.getElementById('loginPassword')
const createDisplayNameInput = document.getElementById('createDisplayName')
const createEmailInput = document.getElementById('createEmail')
const createPasswordInput = document.getElementById('createPassword')
const message = document.getElementById('message')

// this gets the saved accounts from local storage
function getAccounts() {
  const savedAccounts = localStorage.getItem('accounts')

  if (!savedAccounts) {
    return []
  }

  try {
    return JSON.parse(savedAccounts)
  }
  catch (error) {
    return []
  }
}

// this saves the accounts to local storage
function saveAccounts(accounts) {
  localStorage.setItem('accounts', JSON.stringify(accounts))
}

// this checks the email and password fields
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

// this checks the display name field
function validateDisplayName(displayName) {
  if (displayName === '') {
    return 'display name cannot be empty'
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

// this switches between the two page views
function showView(viewName) {
  if (viewName === 'login') {
    loginView.classList.remove('hidden')
    createView.classList.add('hidden')
    loginTab.classList.add('active')
    createTab.classList.remove('active')
  }
  else {
    createView.classList.remove('hidden')
    loginView.classList.add('hidden')
    createTab.classList.add('active')
    loginTab.classList.remove('active')
  }

  showMessage('', false)
}

// this saves a new account after the checks pass
async function submitCreateAccount(event) {
  event.preventDefault()

  const displayName = createDisplayNameInput.value.trim()
  const email = createEmailInput.value.trim().toLowerCase()
  const password = createPasswordInput.value.trim()
  const displayNameError = validateDisplayName(displayName)
  const validationError = validateClientInput(email, password)

  if (displayNameError !== '') {
    showMessage(displayNameError, false)
    return
  }

  if (validationError !== '') {
    showMessage(validationError, false)
    return
  }

  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        displayName: displayName,
        email: email,
        password: password
      })
    })

    const data = await response.json()

    if (!response.ok) {
      showMessage(data.message, false)
      return
    }
  }
  catch (error) {
    showMessage('could not connect to the server', false)
    return
  }

  const accounts = getAccounts()
  const accountExists = accounts.find((account) => account.email === email)

  if (accountExists) {
    showMessage('an account with this email already exists', false)
    return
  }

  accounts.push({
    displayName: displayName,
    email: email,
    password: password
  })

  saveAccounts(accounts)
  createForm.reset()
  showMessage('account created successfully', true)
  showView('login')
}

// this signs the user in with local data after the checks pass
async function submitLogin(event) {
  event.preventDefault()

  const email = loginEmailInput.value.trim().toLowerCase()
  const password = loginPasswordInput.value.trim()
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

    if (!response.ok) {
      showMessage(data.message, false)
      return
    }
  }
  catch (error) {
    showMessage('could not connect to the server', false)
    return
  }

  const accounts = getAccounts()
  const matchedAccount = accounts.find((account) => {
    return account.email === email && account.password === password
  })

  if (!matchedAccount) {
    showMessage('account not found or password does not match', false)
    return
  }

  sessionStorage.setItem('currentDisplayName', matchedAccount.displayName)
  window.location.href = '/welcome.html'
}

loginTab.addEventListener('click', () => {
  showView('login')
})

createTab.addEventListener('click', () => {
  showView('create')
})

loginForm.addEventListener('submit', submitLogin)
createForm.addEventListener('submit', submitCreateAccount)
