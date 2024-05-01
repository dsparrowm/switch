import sibapiv3sdk from 'sib-api-v3-sdk';


/**
 * Helper function responsible for sending invite links from organisations
 * @param email Email of the person to be invited
 * @param orgName Name of the organisation
 */

const defaultClient = sibapiv3sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.EMAIL_API_KEY;

const sendorgInviteLink = async (orgName, mailOptions) => {
    const inviteLink = `http://localhost:3000/api/oranisation/${orgName}/join?InviteCode=1234`;

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

export default sendorgInviteLink;