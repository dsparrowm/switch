import { z } from "zod";
import prisma from "../../db";
import { Request, Response } from 'express';
import { getOrganisationUsersSchema } from "../../utils/validationSchemas";

const getOrganisationUsers = async (req: Request, res: Response) => {
    try {
        const { orgId } = await getOrganisationUsersSchema.parseAsync(req.body);
        const users = await prisma.userOrganisation.findMany({
            where: {
                organisationId: orgId
            },
            include: {
                user: true,
                organisation: true
            }
        });
        if (!users) {
            res.status(400).json({message: "No organization found", isSuccess: false})
            return
        }
        res.status(200);
        res.json({users, isSuccess: true, NoOfUsers: users.length}) 
    } catch (err) {
        if (err instanceof z.ZodError) {
            res.status(400).json({error: err.issues, isSuccess: false})
            return
        }
        res.status(500).json({error: err.message, isSuccess: false})
    }
}

export default getOrganisationUsers;