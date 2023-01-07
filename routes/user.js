const express = require('express')
const {
  handleSignUp,
  handleDeleteUser,
  handleLogin,
} = require('../controller/user')
const router = express.Router()

router.post('/signup', handleSignUp)
router.post('/login', handleLogin)
router.delete('/:userId', handleDeleteUser)

module.exports = router
