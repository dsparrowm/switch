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
export const sendorgInviteLink = async (email, orgName) => {
    const inviteLink = `http://localhost:3000/api/${orgName}/join?InviteCode=1234`;

    const apiInstance = new sibapiv3sdk.TransactionalEmailsApi()
    const sender = {
        email: "daviesaniefiok32@gmail.com",
        name: 'Switch'
    }
    const receivers = [
        {
            email: email,
        }
    ];
    try {
        const sendEmail =  await apiInstance.sendTransacEmail({
            sender,
            to: receivers,
            subject: `Invitation to join ${orgName}`,
            htmlContent: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
            <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
            <html lang="en">
            
              <head></head>
              <div id="__react-email-preview" style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">Read Alex&#x27;s review<div> ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿</div>
              </div>
            
              <body style="background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Roboto,Oxygen-Sans,Ubuntu,Cantarell,&quot;Helvetica Neue&quot;,sans-serif">
                <table style="background-color:#ffffff;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Roboto,Oxygen-Sans,Ubuntu,Cantarell,&quot;Helvetica Neue&quot;,sans-serif" align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" width="100%">
                  <tbody>
                    <tr>
                      <td>
                        <table align="center" role="presentation" cellSpacing="0" cellPadding="0" border="0" width="100%" style="max-width:37.5em;margin:0 auto;padding:20px 0 48px;width:580px">
                          <tr style="width:100%">
                            <td>
                              <table align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" width="100%">
                                <tbody>
                                  <tr>
                                    <td><img alt="Airbnb" src="https://react-email-demo-ijnnx5hul-resend.vercel.app/static/airbnb-logo.png" width="96" height="30" style="display:block;outline:none;border:none;text-decoration:none" /></td>
                                  </tr>
                                </tbody>
                              </table>
                              <table align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" width="100%">
                                <tbody>
                                  <tr>
                                    <td><img alt="Alex" src="https://react-email-demo-ijnnx5hul-resend.vercel.app/static/airbnb-review-user.jpg" width="96" height="96" style="display:block;outline:none;border:none;text-decoration:none;margin:0 auto;margin-bottom:16px;border-radius:50%" /></td>
                                  </tr>
                                </tbody>
                              </table>
                              <table style="padding-bottom:20px" align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" width="100%">
                                <tbody>
                                  <tr>
                                    <td>
                                      <table width="100%" align="center" role="presentation" cellSpacing="0" cellPadding="0" border="0">
                                        <tbody style="width:100%">
                                          <tr style="width:100%">
                                            <p style="font-size:32px;line-height:1.3;margin:16px 0;font-weight:700;color:#484848">Join your team on Switch</p>
                                            <p style="font-size:18px;line-height:1.4;margin:16px 0;color:#484848;padding:24px;background-color:#f2f3f3;border-radius:4px">“Zeno was a great guest! Easy communication, the apartment was left
                                              in great condition, very polite, and respectful of all house rules.
                                              He’s welcome back anytime and would easily recommend him to any
                                              host!”</p>
                                            <p style="font-size:18px;line-height:1.4;margin:16px 0;color:#484848">Now that the review period is over, we’ve posted Alex’s review to your Airbnb profile.</p>
                                            <p style="font-size:18px;line-height:1.4;margin:16px 0;color:#484848;padding-bottom:16px">While it’s too late to write a review of your own, you can send your feedback to Alex using your Airbnb message thread.</p><a href="https://airbnb.com/" target="_blank" style="background-color:#ff5a5f;border-radius:3px;color:#fff;font-size:18px;text-decoration:none;text-align:center;display:inline-block;width:100%;p-y:19px;line-height:100%;max-width:100%;padding:19px 0px"><span><!--[if mso]><i style="letter-spacing: undefinedpx;mso-font-width:-100%;mso-text-raise:28.5" hidden>&nbsp;</i><![endif]--></span><span style="background-color:#ff5a5f;border-radius:3px;color:#fff;font-size:18px;text-decoration:none;text-align:center;display:inline-block;width:100%;p-y:19px;max-width:100%;line-height:120%;text-transform:none;mso-padding-alt:0px;mso-text-raise:14.25px">Send My Feedback</span><span><!--[if mso]><i style="letter-spacing: undefinedpx;mso-font-width:-100%" hidden>&nbsp;</i><![endif]--></span></a>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <hr style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#cccccc;margin:20px 0" />
                              <table align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation" width="100%">
                                <tbody>
                                  <tr>
                                    <td>
                                      <table width="100%" align="center" role="presentation" cellSpacing="0" cellPadding="0" border="0">
                                        <tbody style="width:100%">
                                          <tr style="width:100%">
                                            <p style="font-size:18px;line-height:1.4;margin:16px 0;color:#484848;font-weight:700">Common questions</p>
                                            <p style="font-size:14px;line-height:24px;margin:16px 0"><a target="_blank" style="color:#ff5a5f;text-decoration:none;font-size:18px;line-height:1.4;display:block" href="https://airbnb.com/help/article/13">How do reviews work?</a></p>
                                            <p style="font-size:14px;line-height:24px;margin:16px 0"><a target="_blank" style="color:#ff5a5f;text-decoration:none;font-size:18px;line-height:1.4;display:block" href="https://airbnb.com/help/article/1257">How do star ratings work?</a></p>
                                            <p style="font-size:14px;line-height:24px;margin:16px 0"><a target="_blank" style="color:#ff5a5f;text-decoration:none;font-size:18px;line-height:1.4;display:block" href="https://airbnb.com/help/article/995">Can I leave a review after 14 days?</a></p>
                                            <hr style="width:100%;border:none;border-top:1px solid #eaeaea;border-color:#cccccc;margin:20px 0" />
                                            <p style="font-size:14px;line-height:24px;margin:16px 0;color:#9ca299;margin-bottom:10px">Airbnb, Inc., 888 Brannan St, San Francisco, CA 94103</p><a target="_blank" style="color:#9ca299;text-decoration:underline;font-size:14px" href="https://airbnb.com">Report unsafe behavior</a>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </body>
            
            </html>`
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
    const mailOptions ={
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: 'Verify your Account',
      html: `<p>Verify your acoount with this OTP</P><p style="color:tomato;font-size:25px;letter-spacing:2px;"><b>${generatedOtp}</b></P><p>This code expires in <b>1</b> hour</p>`
    };
    await sendEmail(mailOptions);
    const hashed = await hashPassword(String(generatedOtp));
    // Clear any old record of otp
    const otpUser = await prisma.user.findUnique({
      where: {
        email,
      }
    });
    const checkUser = await prisma.oTP.findFirst({
      where: {
        user_id: otpUser.id
      }
    });
    if (checkUser && checkUser.code) {
      await prisma.oTP.deleteMany({
        where: {
          user_id: checkUser.id
        }
      })
      // create new otp record
      const createOtp = await prisma.oTP.create({
        data: {
          code: hashed,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000),
          user_id: otpUser.id
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
}