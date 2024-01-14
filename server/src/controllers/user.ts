import * as AWS from 'aws-sdk'
import { EXT_TO_MIME } from '../utils/mime'

const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  signatureVersion: 'v4',
  region: process.env.REGION,
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY
})

const getPresignedPutUrl: (userId: string, ext: string) => { url: string; key: string } = (
  userId: string,
  ext: string
) => {
  try {
    const Key = `avatars/${userId}.${ext}`
    const Bucket = 'setmea'
    const ContentType = EXT_TO_MIME[ext]
    const params = { Bucket, Key, Expires: 60, ContentType }
    const url = s3.getSignedUrl('putObject', params)
    const key = `https://setmea.s3.us-west-1.amazonaws.com/${Key}`
    return { url, key }
  } catch (e) {
    return e
  }
}

export { getPresignedPutUrl }
