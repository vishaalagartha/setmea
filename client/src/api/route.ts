import { type RouteTag } from '../types/route'
import request from '../utils/request'

interface RouteProps {
  goal: string
  details: string
  gymId: string
  tags: [RouteTag]
  zone: string
  grade: number
  requestedSetterId: string | undefined
}

const getOpenRoutesByGym = async ({ gymId }: { gymId: string }): Promise<any> => {
  try {
    const res = await request(`routes?gymId=${gymId}&open=true`, {
      method: 'GET'
    })
    return res
  } catch (error) {
    console.error(error)
    return error
  }
}

const getClosedRoutesByGym = async ({ gymId }: { gymId: string }): Promise<any> => {
  try {
    const res = await request(`routes?gymId=${gymId}&open=false`, {
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
  grade,
  requestedSetterId
}: RouteProps): Promise<any> => {
  try {
    const res = await request('routes', {
      method: 'POST',
      body: JSON.stringify({ goal, gymId, details, tags, zone, grade, requestedSetterId })
    })
    return res
  } catch (error) {
    console.error(error)
    return error
  }
}

const deleteRoute = async ({ routeId }: { routeId: string }): Promise<any> => {
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

const closeRoute = async (routeId: string): Promise<any> => {
  try {
    const res = await request(`routes/${routeId}`, {
      method: 'PATCH',
      body: JSON.stringify({ open: false })
    })
    return res
  } catch (error) {
    console.error(error)
    return error
  }
}

const getClimberOpenRequests = async (userId: string): Promise<any> => {
  try {
    const res = await request(`routes/route-requests?open=true&userId=${userId}`, {
      method: 'GET'
    })
    return res
  } catch (error) {
    console.error(error)
    return error
  }
}

const getClimberClosedRequests = async (userId: string): Promise<any> => {
  try {
    const res = await request(`routes/route-requests?open=false&userId=${userId}`, {
      method: 'GET'
    })
    return res
  } catch (error) {
    console.error(error)
    return error
  }
}

const getSetterOpenRequests = async (userId: string): Promise<any> => {
  try {
    const res = await request(`routes/set-requests?open=true&userId=${userId}`, {
      method: 'GET'
    })
    return res
  } catch (error) {
    console.error(error)
    return error
  }
}

const getSetterClosedRequests = async (userId: string): Promise<any> => {
  try {
    const res = await request(`routes/set-requests?open=false&userId=${userId}`, {
      method: 'GET'
    })
    return res
  } catch (error) {
    console.error(error)
    return error
  }
}

const voteRoute = async (id: string): Promise<any> => {
  try {
    const res = await request(`routes/${id}/votes`, {
      method: 'POST'
    })
    return res
  } catch (error) {
    console.error(error)
    return error
  }
}

const unvoteRoute = async (id: string): Promise<any> => {
  try {
    const res = await request(`routes/${id}/votes`, {
      method: 'DELETE'
    })
    return res
  } catch (error) {
    console.error(error)
    return error
  }
}

const getRoute = async (id: string): Promise<any> => {
  try {
    const res = await request(`routes/${id}`, {
      method: 'GET'
    })
    return res
  } catch (error) {
    console.error(error)
    return error
  }
}

export {
  createRoute,
  getOpenRoutesByGym,
  getClosedRoutesByGym,
  deleteRoute,
  closeRoute,
  getClimberOpenRequests,
  getClimberClosedRequests,
  getSetterOpenRequests,
  getSetterClosedRequests,
  voteRoute,
  unvoteRoute,
  getRoute
}
