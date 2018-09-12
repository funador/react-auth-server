exports.twitter = (req, res) => {
  const io = req.app.get('io')
  const user = {
    name: req.user.username,
    photo: req.user.photos[0].value.replace(/_normal/, '')
  }
  io.emit('twitter', user)
  res.end()
}

exports.google = (req, res) => {
  const io = req.app.get('io')
  const user = {
    name: req.user.displayName,
    photo: req.user.photos[0].value.replace(/sz=50/gi, 'sz=250')
  }
  io.emit('google', user)
  res.end()
}

exports.facebook = (req, res) => {
  const io = req.app.get('io')
  const { givenName, familyName } = req.user.name
  const user = {
    name: `${givenName} ${familyName}`,
    photo: req.user.photos[0].value
  }
  io.emit('facebook', user)
  res.end()
}

exports.github = (req, res) => {
  const io = req.app.get('io')
  const user = {
    name: req.user.username,
    photo: req.user.photos[0].value
  }
  io.emit('github', user)
  res.end()
}
