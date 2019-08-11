const mongoose = require('mongoose')
const secrets = require('./secrets')
const dbConnection = mongoose.connection

mongoose.Promise = require('bluebird')
mongoose.connect(
  secrets.MONGODB,
  { useNewUrlParser: true }
)

module.exports = {
  connect() {
    dbConnection.on('error', console.error.bind(console.error))
    dbConnection.once('open', () => {
      console.log('Taxi Connected')
    })
  }
}
