const { encryptPayload } = require('../utils')

class AuthController {
  wake(req, res){
    return res.send('Waking-up');
  }

  google(req, res) {
    const io = req.app.get('io')
    const user = {
      name: req.user.profile.displayName,
      photo: req.user.profile.photos[0].value.replace(/sz=50/gi, 'sz=250'),
      id: req.user.profile.id,
      token: encryptPayload(req.user.accessToken)
    }

    console.log(user, user)

    io.in(req.session.socketId).emit('google', user)
  }
}

module.exports = new AuthController()
