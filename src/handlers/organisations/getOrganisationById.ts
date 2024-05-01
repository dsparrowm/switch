import { z } from "zod";
import { Request, Response } from 'express';
import prisma from "../../db";
import { getOrganisationSchema } from "../../utils/validationSchemas";
import redis from "../../redis";

const getOrganisationById = async (req: Request, res: Response) => {
    try {
        const { orgId } = await getOrganisationSchema.parseAsync(req.query);
        const cachedValue = await redis.get(`org:${orgId}`);
        if (cachedValue) {
            console.log("Organisation retrieved from redis database")
            res.status(200)
            return res.json({message: "Organisation found", org: JSON.parse(cachedValue), isSuccess: true})
        }
        const org = await prisma.organisation.findUnique({
            where: {
                id: orgId
            },
            include: {
                departments: true
            }
       })
       if (!org) {
           res.status(404)
           return res.json({message: "Organisation not found", isSuccess: false})
       }
       await redis.set(`org:${orgId}`, JSON.stringify(org));
       console.log("Organisation retrieved from postgres database")
       res.status(200)
       res.json({message: "Organisation found", org, isSuccess: true})
    } catch (err) {
        if (err instanceof z.ZodError) {
            res.status(400)
            return res.json({message: err.issues, isSuccess: false})
        }
        res.status(500)
        res.json({message: err.message, isSuccess: false})
    }
  }


  export default getOrganisationById;