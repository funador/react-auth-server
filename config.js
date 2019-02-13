const { ExtractJwt } = require('passport-jwt')

exports.providers = ['twitter', 'google', 'facebook', 'github']

const callbacks = this.providers.map(provider => {
  return process.env.NODE_ENV === 'production'
    ? `https://react-auth-twitter.herokuapp.com/${provider}/callback`
    : `https://localhost:8080/${provider}/callback`
})

const [twitterURL, googleURL, facebookURL, githubURL] = callbacks

exports.CLIENT_ORIGIN = process.env.NODE_ENV === 'production'
  ? 'https://react-auth-twitter.netlify.com'
  : ['https://127.0.0.1:3000', 'https://localhost:3000']

exports.TWITTER_CONFIG = {
  consumerKey: process.env.TWITTER_KEY,
  consumerSecret: process.env.TWITTER_SECRET,
  callbackURL: twitterURL,
  userProfileURL  : 'https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true',
  passReqToCallback: true
}

exports.GOOGLE_CONFIG = {
  clientID: process.env.GOOGLE_KEY,
  clientSecret: process.env.GOOGLE_SECRET,
  callbackURL: googleURL,
  passReqToCallback: true
}

exports.FACEBOOK_CONFIG = {
  clientID: process.env.FACEBOOK_KEY,
  clientSecret: process.env.FACEBOOK_SECRET,
  profileFields: ['id', 'emails', 'name', 'picture.width(250)'],
  callbackURL: facebookURL,
  passReqToCallback: true
}

exports.GITHUB_CONFIG = {
  clientID: process.env.GITHUB_KEY,
  clientSecret: process.env.GITHUB_SECRET,
  callbackURL: githubURL,
  passReqToCallback: true
}

const JWT_SECRET = process.env.JWT_SECRET
exports.JWT_SECRET = JWT_SECRET

exports.JWT_CONFIG = {
  secretOrKey: JWT_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
  algorithms: ['HS256']
}

exports.DB_URL = process.env.NODE_ENV === 'production'
  ? process.env.PRODUCTION_DB_URL
  : 'mongodb://localhost/react-social-auth'

exports.PORT = process.env.PORT || 8080

exports.JWT_EXPIRY = process.env.JWT_EXPIRY