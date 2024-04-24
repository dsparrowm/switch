import { z } from "zod";
import { verifyOtpSchema } from "../../utils/validationSchemas";
import validateOtp from "../../helpers/validateOtp";
import { Request, Response } from "express";

const verifyOtp = async (req: Request, res: Response) => {
    try {
        const { userId, otp } = await verifyOtpSchema.parseAsync(req.body);

        const validOtp = await validateOtp(userId, otp)

        if (!validOtp) {
            res.status(400)
            res.json({ message: "Invalid Otp", isSuccess: false });
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
        res.json({message: `${err}`, isSuccess: false})
        return
    }
}

export default verifyOtp;