exports.twitter = (req, res) => {
  const io = req.app.get('io')
  const user = { 
    name: req.user.username,
    photo: req.user.photos[0].value.replace(/_normal/, '')
  }
  io.in(req.session.socketId).emit('twitter', user)
  res.end()
}

exports.google = (req, res) => {
  const io = req.app.get('io')

  const picture = req.user.photos[0].value.split("=")[0] + "=s250-c"
  // since google profile images now look like this:
  // https://lh3.googleusercontent.com/a-/AOh14GiZIAa6AMle83xlofXd-8kBfqvVwZkSRswM2UeI=s200-c

  const user = { 
    name: req.user.displayName,
    photo: picture
  }
  io.in(req.session.socketId).emit('google', user)
  res.end()
}

exports.facebook = (req, res) => {
  const io = req.app.get('io')
  const { givenName, familyName } = req.user.name
  const user = { 
    name: `${givenName} ${familyName}`,
    photo: req.user.photos[0].value
  }
  io.in(req.session.socketId).emit('facebook', user)
  res.end()
}

exports.github = (req, res) => {
  const io = req.app.get('io')
  const user = { 
    name: req.user.username,
    photo: req.user.photos[0].value
  }
  io.in(req.session.socketId).emit('github', user)
  res.end()
} 