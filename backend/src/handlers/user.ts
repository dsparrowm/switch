import { stringify } from "querystring";
import prisma from "../db";
import { createJWT, hashPassword } from "../modules/auth";

export const createNewUser = async (req, res) => {
    const hash = await hashPassword(req.body.password);
    const user = await prisma.user.create({
        data: {
            email: req.body.email,
            password: hash,
            name: req.body.name
        }
    })

    const token = createJWT(user);
    res.json({token});
}

