import prisma from "../db";
import { comparePassword, createJWT, hashPassword } from "../modules/auth";


export const createNewUser = async (req, res) => {
    /**
     * Check if user already exists
     */
    const userExists = await prisma.user.findUnique({
        where: {
            email: req.body.email,
        }
    })

    if (userExists) {
        res.json({message: "User already Exists"});
        return;
    }

    /**
     * if user doesn't exist, go ahead to create a new user
     */
    const hash = await hashPassword(req.body.password);
    const user = await prisma.user.create({
        data: {
            email: req.body.email,
            password: hash,
            name: req.body.name
        }
    })

    const token = createJWT(user);
    res.json({message: "Account Created successfully", token});
}

/**
 * Signin a user and generate a jwt for that user
 */
export const signin = async (req, res) => {
    const user = await prisma.user.findUnique({
        where: {
            email: req.body.email,
        }
    })

    const isValid = await comparePassword(req.body.password, user.password);

    if (!isValid) {
        res.status(401);
        res.json({message: "Invalid email or password"})
        return;
    }

    const token = createJWT(user)
    res.json({message: "Login successful", token});
}

