import nodemailer from 'nodemailer'
import { type SentMessageInfo } from 'nodemailer/lib/smtp-transport'

const transport = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: 'b6f340384967c2',
    pass: '5458bbc23dfdf3'
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
        <p> Please, click the link below to reset your password</p>
        <a href="${link}">Reset Password</a>
    </body>
    </html>
    `)
}

const sendMail: (email: string, token: string, username: string, userId: string) => Promise<SentMessageInfo> = async (email: string, token: string, username: string, userId: string) => {
  const template = createTemplate(token, username, userId)
  try {
    const res = await transport.sendMail({
      from: '"Vishaal Agartha" <vishaalagartha@gmail.com>', // sender address
      to: email, // list of receivers
      subject: 'Hello ✔', // Subject line
      html: template // html body
    })
    return res
  } catch (e) {
    throw new Error('Error sending email.')
  }
}

export { sendMail }
