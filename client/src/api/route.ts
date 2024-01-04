import { type RouteTag } from '../types/route'
import request from '../utils/request'

interface RouteProps {
  goal: string
  details: string
  gymId: string
  tags: [RouteTag]
  zone: string
  requestedSetterId: string | undefined
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

const createRoute = async ({
  goal,
  gymId,
  details,
  tags,
  zone,
  requestedSetterId
}: RouteProps): Promise<any> => {
  try {
    const res = await request('routes', {
      method: 'POST',
      body: JSON.stringify({ goal, gymId, details, tags, zone, requestedSetterId })
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

const getClimberRequests = async (): Promise<any> => {
  try {
    const res = await request(`routes/route-requests`, {
      method: 'GET'
    })
    return res
  } catch (error) {
    console.error(error)
    return error
  }
}

const getSetterRequests = async (): Promise<any> => {
  try {
    const res = await request(`routes/set-requests`, {
      method: 'GET'
    })
    return res
  } catch (error) {
    console.error(error)
    return error
  }
}

export { createRoute, getRoutesByGym, deleteRoute, getClimberRequests, getSetterRequests }
