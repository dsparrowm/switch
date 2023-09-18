import prisma from "../db";
import { comparePassword, createJWT, hashPassword } from "../modules/auth";


export const createNewUser = async (req, res, next) => {
    /**
     * Check if user already exists
     */
    try {
        console.log('Got here', req.body.email)
        const userExists = await prisma.user.findUnique({
            where: {
                email: req.body.email,
            }
        })
        console.log(userExists, 'jkgui');
    
        if (userExists) {
            res.json({message: "User already Exists", isSuccess: false});
            return;
        }
    
        /**
         * if user doesn't exist, go ahead to create a new user
         */
        const hash = await hashPassword(req.body.password);
        const createUser = await prisma.user.create({
            data: {
                email: req.body.email,
                password: hash,
                name: req.body.name,
            }
        })
    
        const user = await prisma.user.findUnique({
            where: {
                email: req.body.email
            }
        });
        req.user = (user);
    
        const token = createJWT(createUser);
        res.json({message: "Account Created successfully", token, user, isSuccess: true});
        next()
    } catch (error) {
        console.log(error)
        res.json({message: "oops! could not reach server", isSuccess: false})   
    }
}

/**
 * Signin a user and generate a jwt for that user
 */
export const signin = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: req.body.email,
            },
            include: {
                organisations: true,
                departments: true,
                tasks: true,
                roles: true
            }
        })
        if (user === null) {
            res.status(400)
            res.json({message: "No user found", isSuccess: false})
            return
        }
        const isValid = await comparePassword(req.body.password, user.password);
        if (!isValid) {
            res.status(401);
            res.json({message: "Invalid email or password", issuccess: false})
            return;
        }
        delete user.password;
    
        const token = createJWT(user)
        res.json({
            message: "Login successful",
            token,
            isSuccess: true,
            user,
        });
    } catch (error) {
        res.json({message: 'oops! unable to reach database server', isSuccess: false})
    }
    
}

