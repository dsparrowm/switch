import { z } from "zod";
import prisma from "../../db";
import { Request, Response } from 'express';
import hashPassword from "../../helpers/hashPassword";
import createJWT from "../../helpers/createJwt";
import { signupSchema } from "../../utils/validationSchemas";

const createNewUser = async (req: Request, res: Response) => {
    /**
     * Check if user already exists
     */
    try {
        const { email, password, name } = await signupSchema.parseAsync(req.body);
        const userExists = await prisma.user.findUnique({
            where: {
                email,
            }
        })
    
        if (userExists) {
            res.status(409)
            res.json({message: "User already Exists", isSuccess: false});
            return;
        }
    
        /**
         * if user doesn't exist, go ahead to create a new user
         */
        const hashedPassword = await hashPassword(password);
        const createdUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            }
        })
        delete createdUser.password
        const token = createJWT(createdUser);
        res.status(200)
        res.json({message: "Account Created successfully", token, createdUser, isSuccess: true});
    } catch (err) {
        if (err instanceof z.ZodError) {
            res.status(400)
            return res.json({message: err.issues, isSuccess: false})
        }
        res.status(400)
        res.json({message: err.message, isSuccess: false})   
    }
}

export default createNewUser;