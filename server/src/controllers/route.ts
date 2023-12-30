import Message from '../models/message'
import Route from '../models/route'
import { type RouteTag } from '../types/route'

const getRoutesByGym: (gymId: string) => Promise<any> = async (gymId) => {
  const routes = await Route.find({ gym: gymId })
  return routes
}

const createRoute: (
  goal: string,
  details: string,
  gym: string,
  tags: RouteTag[],
  user: string
) => Promise<any> = async (
  goal: string,
  details: string,
  gym: string,
  tags: RouteTag[],
  user: string
) => {
  const route = new Route({ goal, details, gym, tags, user })
  await route.save()

  return route
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

export { getRoutesByGym, createRoute, deleteRoute }
