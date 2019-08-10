const bodyParser = require('body-parser')
const logger = require('morgan')
const cors = require('cors')
const createError = require('http-errors')
const session = require('express-session')
const passport = require('passport')
const passportInit = require('./lib/passport.init')

const incomingOriginWhitelist = ['http://localhost:3000', 'localhost:3000']

const corsConfig = (req, next) => {
  let corsOptions
  let incomingOrigin = req.header('host') || req.header('origin')
  if (incomingOriginWhitelist.indexOf(incomingOrigin !== -1)) {
    corsOptions = {
      origin: true,
      credentials: true
    }
    return next(null, corsOptions)
  } else
    corsOptions = {
      origin: false,
      credentials: false
    }
  return next(
    new Error('You like going under the hood, i like you. Contact me ')
  )
}

module.exports = (app, express) => {
  Number.prototype.format = function(n, x, s, c) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
      num = this.toFixed(Math.max(0, ~~n))

    return (c ? num.replace('.', c) : num).replace(
      new RegExp(re, 'g'),
      '$&' + (s || ',')
    )
  }

  const api = require('./routes/api')(express)
  app.use(cors(corsConfig), (req, res, next) => next())

  app.use(logger('dev'))
  app.use(express.json())

  app.use(passport.initialize())
  passportInit()
  app.use(express.urlencoded({ extended: false }))
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

  app.use(
    session({
      key: 'user_key',
      secret: process.env.SESSION_SECRET,
      resave: true,
      saveUninitialized: true,
      cookie: {
        expires: 600000
      }
    })
  )

  app.use('/', api)

  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    next(createError(404))
  })

  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.status(500).json({
      message: err.message,
      error: err
    })
  })
}
