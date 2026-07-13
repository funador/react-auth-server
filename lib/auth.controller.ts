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
  res.send(closePopupHtml)
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
