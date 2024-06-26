import { z } from "zod";
import prisma from "../../db";
import { Request, Response } from 'express';
import { updateOrganisationSchema } from "../../utils/validationSchemas";
import redis from "../../redis";

const updateOrganisation = async (req: Request, res: Response) => {
    try {
        const { name, orgId } = await updateOrganisationSchema.parseAsync(req.body);
        const orgExists = await prisma.organisation.findUnique({
            where: {id: orgId}
        })

        if (!orgExists) {
            res.status(404)
            res.json({message: "Organisation not found", isSuccess: false})
            return
        }
        const updatedOrg = await prisma.organisation.update({
            where: {id: orgId},
            data: {name}
        })
        // await redis.set(`org:${orgId}`, JSON.stringify(updatedOrg));
        res.status(200);
        res.json({message: "successful", updatedOrg, isSuccess: true})
    } catch (err) {
        if (err instanceof z.ZodError) {
            res.status(400)
            res.json({message: err.issues, isSuccess: false})
            return
        }
        res.status(500);
        res.json({message: "Internal server Error", isSuccess: false})
    }
}

export default updateOrganisation;