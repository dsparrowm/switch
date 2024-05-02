import { z } from "zod";
import prisma from "../../db";
import { createDepartmentSchema } from "../../utils/validationSchemas";
import { Request, Response } from 'express';
import redis from "../../redis";

const createDepartment = async (req: Request, res: Response) => {
    try {
      const { userId, departmentName, organisationId } = await createDepartmentSchema.parseAsync(req.body);
      const user = await prisma.user.findUnique({
        where: { id: userId }

      });
      if (!user) {
        res.status(404)
        return res.json({ message: 'User does not exist', isSuccess: false });
      }
  
      const newDepartment = await prisma.department.create({
        data: {
          name: departmentName,
          organisationId,
        },
      });
  
      const admins = await prisma.userRole.findMany({
        where: { role: { name: 'admin' } },
        include: { role: true },
      });
  
      for (const admin of admins) {
        await prisma.userDepartment.create({
          data: {
            userId: admin.id,
            departmentId: newDepartment.id,
          },
        });
      }
        // await redis.del(`departments:${organisationId}`);
        res.status(200)
        res.json({ message: 'Department created successfully', isSuccess: true });
      } catch (err) {
        if (err instanceof z.ZodError) {
          res.status(400)
          return res.json({ message: err.issues, isSuccess: false });
        }
        res.status(500)
        res.json({ message: 'There was an internal server error', isSuccess: false });
      }
    }

    export default createDepartment;