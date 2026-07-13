import { Request, Response } from 'express'
import { Server as SocketServer } from 'socket.io'
import passport from 'passport'

// The user's profile is delivered to the client over the socket, not in
// this response - this page just needs to close itself. We used to rely
// on the opener tab calling popup.close() instead, but OAuth providers
// increasingly send Cross-Origin-Opener-Policy: same-origin on their own
// pages, which severs the opener's reference to this window once the
// popup has navigated through them. A same-origin page closing itself is
// unaffected by that, so it's the reliable path.
const closePopupHtml = `<!DOCTYPE html>
<html><body><script>window.close()</script>You can close this window.</body></html>`

// Meta's own developer dashboard cannot reliably save a text field - the
// "Valid OAuth Redirect URIs" setting silently no-ops in the UI with no
// error, no documented Graph API field, and an open unresolved complaint
// on their own community forum. This one's earned a permanent shoutout.
const closeFacebookPopupHtml = `<!DOCTYPE html>
<html><body><script>window.close()</script>You can close this window. (Meta's own developer dashboard couldn't reliably save a text field to get you here - if you're building on their API, godspeed.)</body></html>`

export const twitter = (req: Request, res: Response) => {
  const io = req.app.get('io') as SocketServer
  const profile = req.user as passport.Profile
  const user = {
    name: profile.username,
    photo: profile.photos![0].value.replace(/_normal/, '')
  }
  io.in(req.session.socketId as string).emit('twitter', user)
  res.send(closePopupHtml)
}

export const google = (req: Request, res: Response) => {
  const io = req.app.get('io') as SocketServer
  const profile = req.user as passport.Profile
  const user = {
    name: profile.displayName,
    photo: profile.photos![0].value.replace(/sz=50/gi, 'sz=250')
  }
  io.in(req.session.socketId as string).emit('google', user)
  res.send(closePopupHtml)
}

export const facebook = (req: Request, res: Response) => {
  const io = req.app.get('io') as SocketServer
  const profile = req.user as passport.Profile
  const { givenName, familyName } = profile.name!
  const user = {
    name: `${givenName} ${familyName}`,
    photo: profile.photos![0].value
  }
  io.in(req.session.socketId as string).emit('facebook', user)
  res.send(closeFacebookPopupHtml)
}

export const github = (req: Request, res: Response) => {
  const io = req.app.get('io') as SocketServer
  const profile = req.user as passport.Profile
  const user = {
    name: profile.username,
    photo: profile.photos![0].value
  }
  io.in(req.session.socketId as string).emit('github', user)
  res.send(closePopupHtml)
}
