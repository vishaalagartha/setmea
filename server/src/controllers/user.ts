import * as AWS from 'aws-sdk'

AWS.config.credentials = new AWS.SharedIniFileCredentials({ profile: 'setmea-admin' })
const s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  signatureVersion: 'v4',
  region: 'us-west-1'
})

const getPresignedPutUrl: (userId: string, ext: string) => ({ url: string, key: string }) = (userId: string, ext: string) => {
  try {
    const Key = `avatars/${userId}.${ext}`
    const Bucket = 'setmea'
    const params = { Bucket, Key, Expires: 60, ContentType: `image/${ext}` }
    const url = s3.getSignedUrl('putObject', params)
    const key = `https://setmea.s3.us-west-1.amazonaws.com/${Key}`
    return { url, key }
  } catch (e) {
    return e
  }
}

export { getPresignedPutUrl }
