import nodemailer from 'nodemailer'


const transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_PASS
    }
  })

export const sendEmail = async (mailOptions) => {
    try {
        await transporter.sendMail(mailOptions)
        return
      } catch (error) {
        throw error;
      }
}