import Route from '../models/route'
import type { IRoute, IRouteData } from '../types/route'
import User from '../models/user'

const formatRoutes: (routes: IRoute[]) => Promise<IRouteData[]> = async (routes: IRoute[]) => {
  const data: IRouteData[] = []
  for (const route of routes) {
    if (!(route instanceof Route)) continue
    const routeData: IRouteData = { ...route.toObject(), username: '', requestedSetterUsername: undefined, setterUsername: undefined, voterUsernames: [] }
    const user = await User.findById(route.user)
    if (user !== null) { routeData.username = user.username }
    if (route.setter !== null) {
      const setter = await User.findById(route.setter)
      if (setter !== null) {
        routeData.setterUsername = setter.username
      }
    }
    if (route.requestedSetter !== null) {
      const requestedSetter = await User.findById(route.requestedSetter)
      if (requestedSetter !== null) {
        routeData.requestedSetterUsername = requestedSetter.username
      }
    }
    for (const v of route.votes) {
      const voter = await User.findById(v)
      if (voter !== null) routeData.voterUsernames.push(voter.username)
    }
    data.push(routeData)
  }
  return data
}
const deleteRoute: (
  routeId: string,
) => Promise<any> = async (
  routeId: string
) => {
  try {
    await Route.findByIdAndDelete(routeId)
  } catch (e) {
    throw new Error('Invalid route id')
  }
}

export { deleteRoute, formatRoutes }
