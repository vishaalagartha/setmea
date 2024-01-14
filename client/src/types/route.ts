interface IRoute {
  _id: string
  goal: string
  details: string
  gymId: string
  tags: [RouteTag]
  user: string
  username: string
  date: string
  requestedSetter: string
  requestedSetterUsername: string
  grade: number
  setter: string
  setterUsername: string
  votes: string[]
  voterUsernames: string[]
  open: boolean
  media: string[]
}

enum RouteTag {
  crimp = 'crimp',
  pinch = 'pinch',
  sloper = 'sloper',
  compression = 'compression',
  competition = 'competition',
  slab = 'slab'
}

export { RouteTag, type IRoute }
