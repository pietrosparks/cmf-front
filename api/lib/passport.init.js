const passport = require('passport')
const { GOOGLE_CONFIG } = require('../dbconfig/secrets')
const { OAuth2Strategy: GoogleStrategy } = require('passport-google-oauth')

module.exports = () => {
  passport.serializeUser((obj, cb) => cb(null, obj))
  passport.deserializeUser((user, cb) => cb(null, user))

  const callback = (accessToken, refreshToken, profile, cb) =>
    cb(null, { profile, accessToken })

  passport.use(new GoogleStrategy(GOOGLE_CONFIG, callback))
}
