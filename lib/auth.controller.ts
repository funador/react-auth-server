import { Request, Response } from 'express'
import { Server as SocketServer } from 'socket.io'
import passport from 'passport'

export const twitter = (req: Request, res: Response) => {
  const io = req.app.get('io') as SocketServer
  const profile = req.user as passport.Profile
  const user = {
    name: profile.username,
    photo: profile.photos![0].value.replace(/_normal/, '')
  }
  io.in(req.session.socketId as string).emit('twitter', user)
  res.end()
}

export const google = (req: Request, res: Response) => {
  const io = req.app.get('io') as SocketServer
  const profile = req.user as passport.Profile
  const user = {
    name: profile.displayName,
    photo: profile.photos![0].value.replace(/sz=50/gi, 'sz=250')
  }
  io.in(req.session.socketId as string).emit('google', user)
  res.end()
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
  res.end()
}

export const github = (req: Request, res: Response) => {
  const io = req.app.get('io') as SocketServer
  const profile = req.user as passport.Profile
  const user = {
    name: profile.username,
    photo: profile.photos![0].value
  }
  io.in(req.session.socketId as string).emit('github', user)
  res.end()
}
