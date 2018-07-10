const callbackURL =  process.env.CALLBACK_URL
  ? process.env.CALLBACK_URL
  : 'http://127.0.0.1:8080/twitter/callback'

exports.CLIENT_ORIGIN = process.env.CLIENT_ORIGIN
  ? process.env.CLIENT_ORIGIN
  : 'http://localhost:3000'

exports.TWITTER_CONFIG = {
  consumerKey: process.env.TWITTER_KEY,
  consumerSecret: process.env.TWITTER_SECRET,
  callbackURL
}