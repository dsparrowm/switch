import { z } from "zod";
import prisma from "../../db";
import { updateDepartmentSchema } from "../../utils/validationSchemas";
import { Request, Response } from 'express';
import redis from "../../redis";

const updateDepartment = async (req: Request, res: Response) => {
    try {
      const { departmentId, departmentName, organisationId} = await updateDepartmentSchema.parseAsync(req.body);
      const departmentExists = await prisma.department.findUnique({
        where: {
          id: departmentId,
          AND: [
            { organisationId }
          ]
        }
      })
      if (!departmentExists) {
        res.status(404);
        return res.json({message: "No department found", isSuccess: false})
      }

      await prisma.department.update({
        where: {
           id: departmentId,
           AND: [
            { organisationId }
          ]
          },
        data: { name: departmentName },
      });
      // await redis.del(`department:${departmentId}`);
      res.status(200)
      res.json({ message: 'Department updated successfully', isSuccess: true });
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400)
        return res.json({ message: err.issues, isSuccess: false });
      }
      res.status(500)
      res.json({ message: 'There was an internal server error', isSuccess: false });
    }
  }

  export default updateDepartment;