import type { RequestHandler, Request, Response } from 'express'
import { Router } from 'express'
import Route from '../models/route'
import { type RouteTag, type IRoute } from '../types/route'
import { getRoutesByGym, deleteRoute, formatRoutes } from '../controllers/route'
import setUserIdFromToken from '../middlewares/setUserIdFromToken'

const router = Router()

// GET all routes by gym
router.get('/', (async (req: Request, res: Response) => {
  try {
    const { gymId } = req.query as { gymId: string }
    const routes = await getRoutesByGym(gymId) as IRoute[]
    const data = await formatRoutes(routes)
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
    const { goal, details, gymId, tags, userId, zone, requestedSetterId, grade } = req.body as {
      goal: string
      details: string
      gymId: string
      tags: RouteTag[]
      zone: string
      userId: string
      requestedSetterId: string
      grade: number
    }
    const route = new Route({ goal, details, gym: gymId, tags, user: userId, zone, requestedSetter: requestedSetterId, grade })
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
    const data = await formatRoutes(routes)
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

// GET all set requests by user id
router.get('/set-requests', setUserIdFromToken, (async (req: Request, res: Response) => {
  try {
    const { userId } = req.body as { userId: string }
    const routes = await Route.find({ requestedSetter: userId })
    const data = await formatRoutes(routes)
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

// POST vote by route id
router.post('/:id/votes', setUserIdFromToken, (async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { userId } = req.body as { userId: string }
    const route = await Route.findById(id)
    if (route !== null) {
      route.votes = [...route.votes, userId]
      await route.save()
      res.status(201).json(route.toObject()).end()
      return
    }
    throw new Error('Unable to find route.')
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

// DELETE vote by route id
router.delete('/:id/votes', setUserIdFromToken, (async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { userId } = req.body as { userId: string }
    const route = await Route.findById(id)
    if (route !== null) {
      route.votes = route.votes.filter((v) => v !== userId)
      await route.save()
      res.status(200).json(route.toObject()).end()
      return
    }
    throw new Error('Unable to find route.')
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
