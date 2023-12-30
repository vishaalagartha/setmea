import type { RequestHandler, Request, Response } from 'express'
import { Router } from 'express'
import Route from '../models/route'
import { type RouteTag, type IRouteWithUser, type IRoute } from '../types/route'
import { createRoute, getRoutesByGym, deleteRoute } from '../controllers/route'
import setUserIdFromToken from '../middlewares/setUserIdFromToken'
import { getUserById } from '../controllers/user'

const router = Router()

// GET all routes by gym
router.get('/', (async (req: Request, res: Response) => {
  try {
    const { gymId } = req.query as { gymId: string }
    const routes = await getRoutesByGym(gymId) as IRoute[]
    const data: IRouteWithUser[] = []
    for (const route of routes) {
      const user = await getUserById(route.user)
      if (route instanceof Route) { data.push({ ...route.toObject(), username: user.username }) }
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
    const { goal, details, gymId, tags, userId } = req.body as {
      goal: string
      details: string
      gymId: string
      tags: RouteTag[]
      userId: string
    }
    const route = await createRoute(goal, details, gymId, tags, userId)
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

export default router
