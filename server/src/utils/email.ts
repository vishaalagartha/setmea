import nodemailer from 'nodemailer'
import path from 'path'
import { type SentMessageInfo } from 'nodemailer/lib/smtp-transport'
import fs from 'fs'
import handlebars from 'handlebars'


const sendMail: (email: string, token: string, username: string, userId: string) => Promise<SentMessageInfo> = async (email: string, token: string, username: string, userId: string) => {
  const transport = nodemailer.createTransport({
    service: 'Gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL,
      pass: process.env.GMAIL_PASS
    }
  })
  const url = process.env.NODE_ENV === 'dev' ? process.env.CLIENT_DEV_URL : process.env.CLIENT_PROD_URL
  const link = `${url}/passwordReset?token=${token}&id=${userId}`
  const filePath = path.join(__dirname, './reset-template.html')
  const file = fs.readFileSync(filePath, 'utf-8')
  const template = handlebars.compile(file)
  const replacements = {
    name: username,
    link
  }

  const htmlToSend = template(replacements)
  try {
    const res = await transport.sendMail({
      from: '"Setmea" <vishaalagartha@gmail.com>', // sender address
      to: email, // list of receivers
      subject: 'Reset Your Setmea Password', // Subject line
      html: htmlToSend
    })
    return res
  } catch (e) {
    throw new Error(JSON.stringify(e))
  }
}

export { sendMail }
