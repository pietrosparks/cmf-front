const passport = require('passport')
const AuthController = require('../controller/auth')
const { addSocketIdtoSession } = require('../utils');

module.exports = api => {
  const googleAuth = passport.authenticate('google', {
    scope: ['profile', 'https://www.googleapis.com/auth/gmail.readonly']
  })

  api.get('/google', addSocketIdtoSession, googleAuth)
  api.get('/google/callback', googleAuth, AuthController.google)
}
