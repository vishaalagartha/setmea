import type { RequestHandler, Request, Response } from 'express'
import { Router } from 'express'
import Route from '../models/route'
import { type RouteTag, type IRouteWithUser, type IRoute } from '../types/route'
import { createRoute, getRoutesByGym, deleteRoute } from '../controllers/route'
import setUserIdFromToken from '../middlewares/setUserIdFromToken'
import User from '../models/user'

const router = Router()

// GET all routes by gym
router.get('/', (async (req: Request, res: Response) => {
  try {
    const { gymId } = req.query as { gymId: string }
    const routes = await getRoutesByGym(gymId) as IRoute[]
    const data: IRouteWithUser[] = []
    for (const route of routes) {
      const user = await User.findById(route.user)
      if (user !== null && route instanceof Route) { data.push({ ...route.toObject(), username: user.username }) }
    }
    res.status(200).json(data).end()
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({
        message: error.message
      })
      .end()
  }
}) as RequestHandler)

// POST route
router.post('/', setUserIdFromToken, (async (req: Request, res: Response) => {
  try {
    const { goal, details, gymId, tags, userId, zone, requestedSetterId } = req.body as {
      goal: string
      details: string
      gymId: string
      tags: RouteTag[]
      zone: string
      userId: string
      requestedSetterId: string
    }
    const route = new Route({ goal, details, gym: gymId, tags, user: userId, zone, requestedSetter: requestedSetterId })
    await route.save()
    res.status(201).json(route.toObject()).end()
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({
        message: error.message
      })
      .end()
  }
}) as RequestHandler)

// DELETE route by id
router.delete('/:id', (async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    await deleteRoute(id)
    res.status(200).json({ message: 'Deleted route.' }).end()
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({
        message: error.message
      })
      .end()
  }
}) as RequestHandler)

// GET all route requests by user id
router.get('/route-requests', setUserIdFromToken, (async (req: Request, res: Response) => {
  try {
    const { userId } = req.body as { userId: string }
    const routes = await Route.find({ user: userId })
    res.status(200).json(routes).end()
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({
        message: error.message
      })
      .end()
  }
}) as RequestHandler)

// GET all set requests by user id
router.get('/set-requests', setUserIdFromToken, (async (req: Request, res: Response) => {
  try {
    const { userId } = req.body as { userId: string }
    const routes = await Route.find({ requestedSetter: userId })
    const data: IRouteWithUser[] = []
    for (const route of routes) {
      const user = await User.findById(route.user)
      if (user !== null && route instanceof Route) { data.push({ ...route.toObject(), username: user.username }) }
    }
    res.status(200).json(data).end()
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({
        message: error.message
      })
      .end()
  }
}) as RequestHandler)

export default router
