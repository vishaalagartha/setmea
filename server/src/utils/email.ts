import nodemailer from 'nodemailer'
import { type SentMessageInfo } from 'nodemailer/lib/smtp-transport'

const transport = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  auth: {
    user: 'vishaalagartha@gmail.com',
    pass: 'TwIYxW4kb9CGq7Op'
  }
})

const createTemplate: (token: string, username: string, userId: string) => string = (token: string, username: string, userId: string) => {
  const url = process.env.NODE_ENV === 'dev' ? process.env.CLIENT_DEV_URL : process.env.CLIENT_PROD_URL
  const link = `${url}/passwordReset?token=${token}&id=${userId}`
  return (
    `
    <html>
    <head>
        <style>

        </style>
    </head>
    <body>
        <p>Hi ${username},</p>
        <p>You requested to reset your password.</p>
        <p>Please, click the link below to reset your password</p>
        <a href="${link}">Reset Password</a>
    </body>
    </html>
    `)
}

const sendMail: (email: string, token: string, username: string, userId: string) => Promise<SentMessageInfo> = async (email: string, token: string, username: string, userId: string) => {
  const template = createTemplate(token, username, userId)
  console.log(template)
  try {
    const res = await transport.sendMail({
      from: '"Setmea" <vishaalagartha@gmail.com>', // sender address
      to: email, // list of receivers
      subject: 'Reset Your Setmea Password', // Subject line
      html: template // html body
    })
    return res
  } catch (e) {
    throw new Error('Error sending email.')
  }
}

export { sendMail }
