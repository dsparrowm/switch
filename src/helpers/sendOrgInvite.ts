import SibApiV3Sdk from 'sib-api-v3-sdk';


/**
 * Helper function responsible for sending invite links from organisations
 * @param email Email of the person to be invited
 * @param orgName Name of the organisation
 */

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.EMAIL_API_KEY;

const sendorgInviteLink = async (orgName, mailOptions) => {

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    try {
      // destructure the mailOptions object
      const {sender, to, subject, htmlContent} = mailOptions
      // send the email
      const sendEmail = await apiInstance.sendTransacEmail({
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