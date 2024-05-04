import { z } from "zod";
import { verifyOtpSchema } from "../../utils/validationSchemas";
import validateOtp from "../../helpers/validateOtp";
import { Request, Response } from "express";
import prisma from "../../db";

const verifyOtp = async (req: Request, res: Response) => {
    try {
        const { userId, otp } = await verifyOtpSchema.parseAsync(req.body);
        const validUser = await prisma.user.findUnique({ where: { id: userId } });
        if (!validUser) {
            res.status(404)
            res.json({ message: "Invalid userId", isSuccess: false });
            return;
        }

        const validOtp = await validateOtp(userId, otp)

        if (!validOtp) {
            res.status(404)
            res.json({ message: "Invalid Otp", isSuccess: false });
            return;
        }

        const expiredOtp = new Date(validOtp.expiresAt) < new Date();
        if (expiredOtp) {
            res.status(404)
            res.json({ message: "Expired Otp", isSuccess: false });
            return;
        }
        res.status(200)
        res.json({ message: "Valid Otp", isSuccess: true });
    } catch (err) {
        if (err instanceof z.ZodError) {
            res.status(400)
            return res.json({ message: err.issues, isSuccess: false });
        }
        res.status(500)
        res.json({message: err.message, isSuccess: false})
        return
    }
}

export default verifyOtp;