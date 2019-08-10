const { encryptPayload } = require('../utils')

class AuthController {
  google(req, res) {
    const io = req.app.get('io');

    const { displayName: name, photos, id } = req.user.profile;

    const user = {
      id,
      name,
      photo: photos[0].value.replace(/sz=50/gi, 'sz=250'),
      token: encryptPayload(req.user.accessToken)
    }

    io.in(req.session.socketId).emit('google', user)
  }
}

module.exports = new AuthController()
