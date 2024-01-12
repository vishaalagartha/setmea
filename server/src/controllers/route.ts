import Route from '../models/route'
import type { IRoute, IRouteData } from '../types/route'
import User from '../models/user'
import { randomUUID } from 'crypto'
import * as AWS from 'aws-sdk'
import { EXT_TO_MIME } from '../utils/mime'

const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  signatureVersion: 'v4',
  region: process.env.REGION,
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY
})

const formatRoutes: (routes: IRoute[]) => Promise<IRouteData[]> = async (routes: IRoute[]) => {
  const data: IRouteData[] = []
  for (const route of routes) {
    if (!(route instanceof Route)) continue
    const routeData: IRouteData = {
      ...route.toObject(),
      username: '',
      requestedSetterUsername: undefined,
      setterUsername: undefined,
      voterUsernames: []
    }
    const user = await User.findById(route.user)
    if (user !== null) {
      routeData.username = user.username
    }
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

const getPresignedPutUrl: (routeId: string, ext: string) => { url: string, key: string } = (
  routeId: string,
  ext: string
) => {
  try {
    const ContentType = EXT_TO_MIME[ext]
    const Key = `routes/${routeId}_${randomUUID()}.${ext}`
    const Bucket = 'setmea'
    const params = { Bucket, Key, Expires: 60, ContentType }
    const url = s3.getSignedUrl('putObject', params)
    const key = `https://setmea.s3.us-west-1.amazonaws.com/${Key}`
    return { url, key }
  } catch (e) {
    return e
  }
}

const deleteRouteMedia: (route: IRoute) => Promise<any> = async (route: IRoute) => {
  try {
    const Bucket = 'setmea'
    const Objects = route.media.map((url) => {
      const arr = url.split('/')
      return { Key: `routes/${arr[arr.length - 1]}` }
    })
    await s3.deleteObjects({ Bucket, Delete: { Objects } }).promise()
  } catch (error) {
    return error
  }
}

export { formatRoutes, getPresignedPutUrl, deleteRouteMedia }
