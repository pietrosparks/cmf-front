const express = require('express')
const app = express()

require('dotenv').load()
require('./config')(app, express)

// view engine setup

module.exports = app
