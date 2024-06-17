import { z } from "zod";
import prisma from "../../db";
import { Request, Response } from 'express';
import { joinDepartmentSchema } from "../../utils/validationSchemas";
import redis from "../../redis";

const addDepartmentUsers = async (req: Request, res: Response) => {
    try {
      const { userIds, adminOrDeptHeadId, departmentId } = await joinDepartmentSchema.parseAsync(req.body);
  
      const manager = await prisma.user.findUnique({
        where: { id: adminOrDeptHeadId },
        include: { roles: true },
      });
      
        // make sure the user is a manager of the department
      // if (!manager || !manager.roles.some((role) => role.roleId === 1)) {
      //   res.status(403)
      //   return res.json({ message: 'You do not have permission to add users to this department', isSuccess: false });
      // }
  
      await prisma.department.update({
        where: { id: departmentId },
        data: {
          users: {
            create: userIds.map((id) => ({ userId: id })),
          },
        },
      });
      // await redis.del(`department:${departmentId}`);
      res.status(200)
      res.json({ message: 'User(s) added successfully to department', isSuccess: true });
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400)
        return res.json({ message: err.issues, isSuccess: false });
      }
      res.status(500)
      res.json({ error: err.message, isSuccess: false });
    }
  }

  export default addDepartmentUsers;