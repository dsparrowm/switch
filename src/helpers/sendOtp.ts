import prisma from "../db";
import { hashPassword } from "./auth";
import generateOtp from "./generateOtp";
import sendorgInviteLink from "./sendOrgInvite";

/**
 * Helper function responsible for sending verification email with otp
 * 
 */
export const sendOtp = async (email, id) => {
    try {
      // Generate a new otp
      const generatedOtp = await generateOtp();
  
      // Email Options
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
    // Send Email
      sendorgInviteLink('Switch', mailOptions);
      const hashed = await hashPassword(String(generatedOtp));
      // Clear any old record of otp
      const otpUser = await prisma.user.findUnique({
        where: {
          email,
        }
      });

      const now = new Date();
      const timezoneOffsetMilliseconds = now.getTimezoneOffset() * 60 * 1000;
      
      // create new otp record
      // const createdAt = ;
      await prisma.oTP.create({
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