import { z } from "zod";
import prisma from "../../db";
import { Request, Response, response } from 'express';
import { getOrganisationUsersSchema } from "../../utils/validationSchemas";
import redis from "../../redis";

const getOrganisationUsers = async (req: Request, res: Response) => {
    try {
        const { organisationId } = await getOrganisationUsersSchema.parseAsync(req.query);
        // const cachedValue = await redis.get(`org:${orgId}:users`);
        // if (cachedValue) {
        //     res.status(200)
        //     res.json({users: JSON.parse(cachedValue), isSuccess: true})
        //     return
        // }
        const orgExists = await prisma.organisation.findUnique({
            where: {
                id: organisationId
            }
        })

        if (!orgExists) {
            res.status(404)
            res.json({message: "No organization found", isSuccess: false})
            return
        }
        
        const query = await prisma.userOrganisation.findMany({
            where: {
                organisationId,
            },
            include: {
                user: true,
            }
        });
        
        const users = query.map((data) => {
            delete data.user.password;
            return ({...data.user})
        })
        // await redis.set(`org:${orgId}:users`, JSON.stringify(users));
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