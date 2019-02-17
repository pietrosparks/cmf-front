const mailController = require('../controller/mail')
const { requestAuthorization } = require('../utils')

module.exports = api => {
  api.get('/mail', requestAuthorization, mailController.list)
}
