const providers = ['twitter', 'google', 'facebook', 'github']

const callbacks = providers.map(provider => {
  return process.env.NODE_ENV === 'production'
    ? `https://react-multi-auth-server.vercel.app/${provider}/callback`
    : `https://localhost:8080/${provider}/callback`
})

const [twitterURL, googleURL, facebookURL, githubURL] = callbacks

export const SESSION_SECRET = process.env.SESSION_SECRET as string
export const REDIS_URL = process.env.REDIS_URL as string

export const CLIENT_ORIGIN = process.env.NODE_ENV === 'production'
  ? 'https://react-multi-auth.vercel.app'
  : ['https://127.0.0.1:3000', 'https://localhost:3000']

export const TWITTER_CONFIG = {
  consumerKey: process.env.TWITTER_KEY as string,
  consumerSecret: process.env.TWITTER_SECRET as string,
  callbackURL: twitterURL
}

export const GOOGLE_CONFIG = {
  clientID: process.env.GOOGLE_KEY as string,
  clientSecret: process.env.GOOGLE_SECRET as string,
  callbackURL: googleURL
}

export const FACEBOOK_CONFIG = {
  clientID: process.env.FACEBOOK_KEY as string,
  clientSecret: process.env.FACEBOOK_SECRET as string,
  profileFields: ['id', 'emails', 'name', 'picture.width(250)'],
  callbackURL: facebookURL
}

export const GITHUB_CONFIG = {
  clientID: process.env.GITHUB_KEY as string,
  clientSecret: process.env.GITHUB_SECRET as string,
  callbackURL: githubURL
}
