import { z } from "zod";
import prisma from "../../db";
import { Request, Response } from 'express';
import { updateOrganisationSchema } from "../../utils/validationSchemas";

const updateOrganisation = async (req: Request, res: Response) => {
    try {
        const {name, orgId} = await updateOrganisationSchema.parseAsync(req.body);
       if (name) {
        await prisma.organisation.update({
            where: {id: orgId},
            data: {name}
        })
       }
       res.status(200).json({message: "successful", isSuccess: true})
    } catch (err) {
        if (err instanceof z.ZodError) {
            res.status(400).json({message: err.issues, isSuccess: false})
            return
        }
        res.status(400).json({message: err.message, isSuccess: false})
    }
}

export default updateOrganisation;