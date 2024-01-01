import { type RouteTag } from '../types/route'
import request from '../utils/request'

interface RouteProps {
  goal: string
  details: string
  gymId: string
  tags: [RouteTag]
  zone: string
}

const getRoutesByGym = async ({ gymId }: { gymId: string }): Promise<any> => {
  try {
    const res = await request(`routes?gymId=${gymId}`, {
      method: 'GET'
    })
    return res
  } catch (error) {
    console.error(error)
    return error
  }
}

const createRoute = async ({ goal, gymId, details, tags, zone }: RouteProps): Promise<any> => {
  try {
    const res = await request('routes', {
      method: 'POST',
      body: JSON.stringify({ goal, gymId, details, tags, zone })
    })
    return res
  } catch (error) {
    console.error(error)
    return error
  }
}

interface DeleteRouteProps {
  routeId: string
}

const deleteRoute = async ({ routeId }: DeleteRouteProps): Promise<any> => {
  try {
    const res = await request(`routes/${routeId}`, {
      method: 'DELETE'
    })
    return res
  } catch (error) {
    console.error(error)
    return error
  }
}

export { createRoute, getRoutesByGym, deleteRoute }
