import nodemailer from 'nodemailer'


const transporter = nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    auth: {
      user: process.env.AUTH_EMAIL,
      pass: process.env.AUTH_PASS
    }
  })

const sendEmail = async (mailOptions) => {
    try {
        await transporter.sendMail(mailOptions)
        return
      } catch (error) {
        throw error;
      }
}

export default sendEmail;