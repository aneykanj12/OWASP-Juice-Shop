const express = require('express')
const path = require('path')

const app = express()
const PORT = 3000

app.use(express.json())
app.use(express.static(path.join(__dirname, '..', 'client_side')))

function validateServerInput(email, password) {
  if (!email || !password) {
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

app.post('/api/login', (req, res) => {
  const email = req.body.email ? req.body.email.trim() : ''
  const password = req.body.password ? req.body.password.trim() : ''
  const validationError = validateServerInput(email, password)

  if (validationError !== '') {
    return res.status(400).json({
      message: validationError
    })
  }

  return res.status(200).json({
    message: 'login input passed client side and server side validation'
  })
})

app.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`)
})
