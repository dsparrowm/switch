import { z } from "zod";
import { Request, Response } from 'express';
import prisma from "../../db";
import { getOrganisationSchema } from "../../utils/validationSchemas";

const getOrganisationById = async (req: Request, res: Response) => {
    try {
      const { orgId } = await getOrganisationSchema.parseAsync(req.query);
       const org = await prisma.organisation.findUnique({
        where: {
            id: orgId
        },
        include: {
            departments: true
        }
       })
       if (!org) {
           return res.status(400).json({message: "Organisation not found", isSuccess: false})
       }
       res.status(200).json({message: "Organisation found", org, isSuccess: true})
    } catch (err) {
        if (err instanceof z.ZodError) {
            return res.status(400).json({message: err.issues, isSuccess: false})
        }
        res.status(400).json({message: err.message, isSuccess: false})
    }
  }


  export default getOrganisationById;