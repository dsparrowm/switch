import { z } from "zod";
import prisma from "../../db";
import { Request, Response } from 'express';
import { hashPassword, createJWT } from "../../modules/auth";
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
            res.status(409).json({message: "User already Exists", isSuccess: false});
            return;
        }
    
        /**
         * if user doesn't exist, go ahead to create a new user
         */
        const hash = await hashPassword(password);
        const createUser = await prisma.user.create({
            data: {
                email,
                password: hash,
                name,
            }
        })
    
        const user = await prisma.user.findUnique({
            where: {
                email: req.body.email
            }
        });
        delete user.password
        const token = createJWT(createUser);
        res.json({message: "Account Created successfully", token, user, isSuccess: true});
    } catch (err) {
        if (err instanceof z.ZodError) {
            res.status(400).json({message: err.issues, isSuccess: false})
        }
        res.status(400).json({message: err.message, isSuccess: false})   
    }
}

export default createNewUser;