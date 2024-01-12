import { type IGym } from './gym'

interface IRoute {
  goal: string
  details: string | undefined
  gym: IGym
  tags: RouteTag[]
  user: string
  requestedSetter: string
  setter: string
  votes: string[]
  zone: string
  grade: number
  date: Date
  open: boolean
  media: string[]
}

interface IRouteData extends IRoute {
  username: string
  requestedSetterUsername: string | undefined
  setterUsername: string | undefined
  voterUsernames: string[]
}

enum RouteTag {
  crimp = 'crimp',
  pinch = 'pinch',
  sloper = 'sloper',
  compression = 'compression',
  competition = 'competition',
  slab = 'slab'
}

export { RouteTag, type IRoute, type IRouteData }
