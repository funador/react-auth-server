const passport = require('passport')
const { Strategy: TwitterStrategy } = require('passport-twitter')
const { OAuth2Strategy: GoogleStrategy } = require('passport-google-oauth')
const { Strategy: FacebookStrategy } = require('passport-facebook')
const { Strategy: GithubStrategy} = require('passport-github')
const { Strategy: JwtStrategy } = require('passport-jwt')
const User = require('./user.model')
const normalizeProfileData = require('./normalize.profile.data')
const { 
  TWITTER_CONFIG, GOOGLE_CONFIG, FACEBOOK_CONFIG, GITHUB_CONFIG, JWT_CONFIG
} = require('../config')


module.exports = () => {  

  // Allowing passport to serialize and deserialize users into sessions
  passport.serializeUser((user, cb) => cb(null, user))
  passport.deserializeUser((obj, cb) => cb(null, obj))
  
  // The callback that is invoked when an OAuth provider sends back user 
  // information. Normally, you would save the user to the database 
  // in this callback and it would be customized for each provider
  const oAuthCallback = (accessToken, refreshToken, profile, cb) => {
    const email = profile.emails[0].value
    const { provider } = profile

    if(!email) {
      return console.log('no email provided')
    }

    const update = {
      [provider]: normalizeProfileData(profile)
    }

    User.findOneAndUpdate({email}, {$set: update}, {upsert: true, new: true})
      .then(token => cb(null, token)) 
  }

  const jwtCallback = (payload, cb) => {
    User.findOne(payload.email)
      .then(user => cb(null, user))
  }

  // Adding each OAuth provider and JWT strategies to passport
  passport.use(new TwitterStrategy(TWITTER_CONFIG, oAuthCallback))
  passport.use(new GoogleStrategy(GOOGLE_CONFIG, oAuthCallback))
  passport.use(new FacebookStrategy(FACEBOOK_CONFIG, oAuthCallback))
  passport.use(new GithubStrategy(GITHUB_CONFIG, oAuthCallback))
  passport.use(new JwtStrategy(JWT_CONFIG, jwtCallback))
}