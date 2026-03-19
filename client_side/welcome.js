const welcomeText = document.getElementById('welcomeText')
const signOutButton = document.getElementById('signOutButton')

// this puts the saved display name on the page in a safe way
function loadWelcomeMessage() {
  const currentDisplayName = sessionStorage.getItem('currentDisplayName')

  if (!currentDisplayName) {
    window.location.href = '/'
    return
  }

  welcomeText.textContent = 'Hi ' + currentDisplayName
}

// this clears the session and goes back to login
function signOut() {
  sessionStorage.removeItem('currentDisplayName')
  window.location.href = '/'
}

signOutButton.addEventListener('click', signOut)
loadWelcomeMessage()
