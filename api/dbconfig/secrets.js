require('dotenv').load()

let MONGODB
let BASEURL

if (process.env.NODE_ENV == 'production') {
  MONGODB = process.env.MONGODB_URI
  BASEURL = process.env.BASEURL_PROD
} else {
  MONGODB = process.env.MONGODB_DEV
  BASEURL = process.env.BASEURL_DEV
}

let GOOGLE_CONFIG = {
  clientID: process.env.GOOGLE_CLIENT,
  clientSecret: process.env.GOOGLE_SECRET,
  callbackURL: process.env.CALLBACK_URL
}

module.exports = {
  MONGODB,
  BASEURL,
  GOOGLE_CONFIG,
  JWT_SECRET: process.env.JWT_SECRET,
  FETCH_MAIL_URL: process.env.FETCH_MAIL_URL, 
  GEO_USERNAME: process.env.GEO_USERNAME,
}
