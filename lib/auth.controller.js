exports.twitter = (req, res) => {
  const io = req.app.get('socketio')
  const user = { 
    name: req.user.username,
    photo: req.user.photos[0].value.replace(/_normal/, '')
  }
  io.in('twitter').emit('twitter', user)
  res.end()
}

exports.google = (req, res) => {
  const io = req.app.get('socketio')
  const user = { 
    name: req.user.displayName,
    photo: req.user.photos[0].value.replace(/sz=50/gi, 'sz=250')
  }
  io.in('google').emit('google', user)
  res.end()
}

exports.facebook = (req, res) => {
  const io = req.app.get('socketio')
  const { givenName, familyName } = req.user.name
  const user = { 
    name: `${givenName} ${familyName}`,
    photo: req.user.photos[0].value
  }
  io.in('facebook').emit('facebook', user)
  res.end()
}

exports.github = (req, res) => {
  const io = req.app.get('socketio')
  const user = { 
    name: req.user.username,
    photo: req.user.photos[0].value
  }
   io.in('github').emit('github', user)
  res.end()
} 