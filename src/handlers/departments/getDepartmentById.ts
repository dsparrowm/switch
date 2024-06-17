import { z } from "zod";
import prisma from "../../db";
import { Request, Response } from 'express'
import { getDepartmentSchema } from "../../utils/validationSchemas";
import redis from "../../redis";

const getDepartmentById = async (req: Request, res: Response) => {
    try {
      const { departmentId, organisationId } = await getDepartmentSchema.parseAsync(req.query);
      // const cachedValue = await redis.get(`department:${departmentId}`);
      // if (cachedValue) {
      //   res.status(200)
      //   return res.json({ department: JSON.parse(cachedValue), isSuccess: true });
      // }
      const department = await prisma.department.findUnique({
        where: {
          id: departmentId,
          AND: [
            { organisationId }
          ]
        },
      });
  
      if (!department) {
        res.status(404)
        return res.json({ message: 'No department found', isSuccess: false });
      }
      // await redis.set(`department:${departmentId}`, JSON.stringify(department));
      res.status(200)
      res.json({ department, isSuccess: true });
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400)
        return res.json({ message: err.issues, isSuccess: false });
      }
      res.status(500)
      res.json({ message: err.message, isSuccess: false });
    }
  }

  export default getDepartmentById;