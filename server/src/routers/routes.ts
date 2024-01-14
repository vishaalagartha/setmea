import type { RequestHandler, Request, Response } from 'express'
import { Router } from 'express'
import Route from '../models/route'
import { type RouteTag, type IRoute } from '../types/route'
import User from '../models/user'
import { deleteRouteMedia, formatRoutes, getPresignedPutUrl } from '../controllers/route'
import setUserIdFromToken from '../middlewares/setUserIdFromToken'
import { createMessage } from '../controllers/message'

const router = Router()

// GET all routes by gym
router.get('/', (async (req: Request, res: Response) => {
  try {
    const { gymId, open } = req.query as { gymId: string; open: boolean | undefined }
    const routes = await Route.find({ gym: gymId, open })
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

// GET all route requests by user id
router.get('/route-requests', (async (req: Request, res: Response) => {
  try {
    const { open, userId } = req.query
    const routes = await Route.find({ user: userId, open })
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
router.get('/set-requests', (async (req: Request, res: Response) => {
  try {
    const { open, userId } = req.query
    const routes = await Route.find({ requestedSetter: userId, open })
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

// GET all sets by user id
router.get('/sets', setUserIdFromToken, (async (req: Request, res: Response) => {
  try {
    const { userId } = req.body as { userId: string }
    const routes = await Route.find({ setter: userId })
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

// GET route by id
router.get('/:id', (async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const route = await Route.findById(id)
    if (route === null) {
      res.status(404).json({ message: 'Route not found' }).end()
      return
    }
    const data = await formatRoutes([route])
    res.status(200).json(data[0]).end()
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

// POST route media
router.post('/:id/media', (async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const mediaFiles = req.body
    const route = await Route.findByIdAndUpdate(id, { media: mediaFiles }, { new: true })
    res.status(200).json(route).end()
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
    const route = new Route({
      goal,
      details,
      gym: gymId,
      tags,
      user: userId,
      zone,
      requestedSetter: requestedSetterId,
      grade
    })
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
    const deleted = (await Route.findByIdAndDelete(id)) as unknown as IRoute
    await deleteRouteMedia(deleted)
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
    }
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

// PATCH media by route id - get presigned url to post
router.patch('/:id/media', (async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const ext = (req.query.fileType as string).split('/')[1]
    const { url, key } = getPresignedPutUrl(id, ext)
    res.status(200).json({ url, key }).end()
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

// PATCH route by route id
router.patch('/:id', setUserIdFromToken, (async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { open, userId } = req.body as { open: boolean; userId: string }
    const setter = await User.findById(userId)
    const route = await Route.findByIdAndUpdate(id, { open, setter: userId }, { new: true })
    if (route?.votes !== undefined && setter !== null) {
      for (const voter of route.votes) {
        const content = `${
          setter.username
        } set a climb you liked! <a href="/routes/${route._id.toString()}">Click here to view the route.</a>`
        await createMessage(userId, voter, content)
      }
    }
    res.status(200).json(route).end()
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
