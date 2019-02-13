const jwt = require('jsonwebtoken')
const User = require('./user.model')
const { providers, JWT_EXPIRY, JWT_SECRET } = require('../config')

const createAuthToken = user =>
  jwt.sign({user}, JWT_SECRET, {
    subject: user.email,
    expiresIn: JWT_EXPIRY,
    algorithm: 'HS256'
  })

providers.forEach(provider => {
  exports[provider] = (req, res) => {
    const io = req.app.get('io')
    const authToken = createAuthToken(req.user)
    io.in(req.session.socketId).emit(provider, authToken)
    res.end()
  }
})

exports.refresh = (req, res) => {
  res.json(createAuthToken(req.user))
}

exports.unlink = (req, res) => {
  const { email } = req.user
  const update = {
    [req.params.provider]: {}
  }

  User.findOneAndUpdate(email, update)
    .then(() => res.status(204).end())
}

exports.logout = (req, res) => {
  req.session.sessionEmail = ''
  req.session.passport = {}
  res.status(204).end()
}