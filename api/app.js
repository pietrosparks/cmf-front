const express = require('express')
const app = express()
const { connect } = require('./dbconfig/database')

require('dotenv').load()
require('./config')(app, express)

// view engine setup

module.exports = app
