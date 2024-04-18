import prisma from "../db";
import { comparePassword } from "../modules/auth";

export const verifyotp = async (id, otp) => {
    try {
        var otp_user = await prisma.oTP.findFirst({
            where: {
                userId: id
            }
        }) 
    } catch (err) {
        throw new Error("Could not reach database server")
    }
    if (otp_user === null) {
        throw new Error("No otp record found for this user")
    }
    if (!otp_user.code) {
        throw new Error("User was not issued any otp")
    }
    let {expiresAt} = otp_user;
    let newDate = new Date();
    const timezoneOffsetMilliseconds = newDate.getTimezoneOffset() * 60 * 1000;
    const now = new Date(newDate.getTime() + timezoneOffsetMilliseconds)
        
    if (now > expiresAt) {
        throw new Error("Code has expired")
    }
    const isValid = await comparePassword(String(otp), otp_user.code);
    return isValid;
}