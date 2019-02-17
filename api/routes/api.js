


module.exports = express => {
  const api = express.Router()
  
  require('./auth')(api)
  require('./mail')(api)

  return api
}
