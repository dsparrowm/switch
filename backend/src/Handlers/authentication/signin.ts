import { z } from "zod";
import prisma from "../../db";
import { comparePassword, createJWT } from "../../modules/auth";
import { Request, Response } from 'express'
import { loginSchema } from "../../utils/validationSchemas";

const signin = async (req: Request, res: Response) => {
    try {
        const { email, password } = await loginSchema.parseAsync(req.body);
        let user = await prisma.user.findUnique({
            where: {
                email,
            },
            include: {
                organisations: true,
                departments: true,
                roles: true
            }
        })
        if (!user) {
            return res.status(404).json({message: "No user found", isSuccess: false})
        }
        const isValid = await comparePassword(password, user.password);
        if (!isValid) {
            return res.status(401).json({message: "Invalid email or password", issuccess: false})
        }
        const roles = await prisma.role.findMany({
            where: {
                users: {
                    some: {
                        userId: user.id
                    }
                }
            }
        })
        delete user.password;
        delete user.roles;
        user['role'] = roles
        const token = createJWT(user)
        res.json({
            message: "Login successful",
            token,
            user,
            isSuccess: true,
        });
    } catch (err) {
        if (err instanceof z.ZodError) {
            res.status(400).json({message: err.issues, isSuccess: false})
        }
        res.json({message: err.message, isSuccess: false})
    }
    
}

export default signin;