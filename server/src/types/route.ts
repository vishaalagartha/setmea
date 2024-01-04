import { type IGym } from './gym'

interface IRoute {
  goal: string
  details: string | undefined
  gym: IGym
  tags: RouteTag[]
  user: string
  requestedSetter: string
  setter: string
  votes: number
  zone: string
  date: Date
}

interface IRouteWithUser extends IRoute {
  username: string
}

enum RouteTag {
  crimp = 'crimp',
  pinch = 'pinch',
  sloper = 'sloper',
  compression = 'compression',
  competition = 'competition',
  slab = 'slab'
}

export { RouteTag, type IRoute, type IRouteWithUser }
