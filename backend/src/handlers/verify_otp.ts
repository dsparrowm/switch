import { error } from "console";
import prisma from "../db";
import { comparePassword } from "../modules/auth";

export const verifyotp = async (id, otp) => {
    try {
        const otp_user = await prisma.oTP.findFirst({
            where: {
                userId: id
            }
        })
        if (!otp_user.code) {
            throw error("User was not issued OTP")
        }
        let {expiresAt} = otp_user;
        let now = new Date();
        if (now > expiresAt) {
            throw error("Code has expired, request a new on")
        }
    
        const isValid = comparePassword(String(otp), otp_user.code);
        return isValid;
    } catch (error) {
        throw error("Could not reach database")
        return
    }
}