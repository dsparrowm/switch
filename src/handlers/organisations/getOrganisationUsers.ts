import { z } from "zod";
import prisma from "../../db";
import { Request, Response } from 'express';
import { getOrganisationUsersSchema } from "../../utils/validationSchemas";
import redis from "../../redis";

const getOrganisationUsers = async (req: Request, res: Response) => {
    try {
        const { orgId } = await getOrganisationUsersSchema.parseAsync(req.body);
        const cachedValue = await redis.get(`org:${orgId}:users`);
        if (cachedValue) {
            console.log("Organisation users retrieved from redis database")
            res.status(200)
            res.json({users: JSON.parse(cachedValue), isSuccess: true})
            return
        }
        const orgExists = await prisma.organisation.findUnique({
            where: {
                id: orgId
            }
        })

        if (!orgExists) {
            res.status(404)
            res.json({message: "No organization found", isSuccess: false})
            return
        }
        
        const users = await prisma.userOrganisation.findMany({
            where: {
                organisationId: orgId
            },
            include: {
                user: true,
                organisation: true
            }
        });
        await redis.set(`org:${orgId}:users`, JSON.stringify(users));
        res.status(200);
        res.json({users, isSuccess: true, NoOfUsers: users.length}) 
    } catch (err) {
        if (err instanceof z.ZodError) {
            res.status(400)
            res.json({error: err.issues, isSuccess: false})
            return
        }
        res.status(500)
        res.json({error: err.message, isSuccess: false})
    }
}

export default getOrganisationUsers;