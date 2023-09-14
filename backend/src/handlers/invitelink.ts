import { error } from 'console';
import nodemailer from 'nodemailer'
import sibapiv3sdk from 'sib-api-v3-sdk'
import prisma from '../db';
import generateOtp from '../modules/generateOtp';
import { hashPassword } from '../modules/auth';
import { sendEmail } from './email';

const defaultClient = sibapiv3sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.EMAIL_API_KEY;

/**
 * Route handler responsible for sending invites links from organisations
 * @param email Email of the person to be invited
 * @param orgName Name of the organisation
 */
export const sendorgInviteLink = async (orgName, mailOptions) => {
    const inviteLink = `http://localhost:3000/api/${orgName}/join?InviteCode=1234`;

    const apiInstance = new sibapiv3sdk.TransactionalEmailsApi()
    try {
      const {sender, to, subject, htmlContent} = mailOptions
      const sendEmail =  await apiInstance.sendTransacEmail({
        sender,
        to,
        subject,
        htmlContent
      })
    } catch (error) {
        console.log(error)
    }
}

/**
 * Route handler responsible for sending verification email with otp
 * 
 */
export const sendOtp = async (email, id) => {
  try {
    // Generate a new otp
    const generatedOtp = await generateOtp();
    console.log(`generated otp: ${generatedOtp}`);

    //send email
    const receivers = [
      {
          email,
      }
  ];
    const mailOptions = {
      sender: {
          name: "Switch",
          email: 'support@switch.com',
      },
      to: receivers,
      subject: `Verify your account`,
      htmlContent: `<p style="color:black;font-size:22px;"><b>Switch account</b></p><p style="color:blue;letter-spacing:3px;font-size:30px;padding-top: 0px">Security Code</p><p>Please use the code below to verify your account</p><p style="color:tomato;font-size:25px;letter-spacing:2px;"><b>${generatedOtp}</b></p><p>This code expires in <b>1 hour(s)</b></p><p>If you didn't request this code, you can safely ignore this email. Someone else might have typed your email address by mistake.</p><p>Thanks,<br>Switch account team</p>`,
  };
    sendorgInviteLink('Switch', mailOptions);
    const hashed = await hashPassword(String(generatedOtp));
    // Clear any old record of otp
    const otpUser = await prisma.user.findUnique({
      where: {
        email,
      }
    });
    console.log(`value of otpuser name: ${otpUser.name}`)
    const now = new Date();
    const timezoneOffsetMilliseconds = now.getTimezoneOffset() * 60 * 1000;
    console.log("Code runs to this point")
    // create new otp record
    // const createdAt = ;
    const createOtp = await prisma.oTP.create({
      data: {
        code: hashed,
        userId: otpUser.id,
        createdAt: new Date(now.getTime() + timezoneOffsetMilliseconds),
        expiresAt: new Date(now.getTime() + timezoneOffsetMilliseconds + 60 * 60 * 1000)
      }
    });
  } catch (error) {
    console.log(error);
  }
}