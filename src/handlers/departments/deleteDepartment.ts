import { z } from "zod";
import prisma from "../../db";
import { deleteDepartmentSchema } from "../../utils/validationSchemas";
import { Request, Response } from 'express';

const deleteDepartment = async (req: Request, res: Response) => {
    try {
      const { departmentId, organisationId } = await deleteDepartmentSchema.parseAsync(req.body);

      const departmentExist = await prisma.department.findUnique({
        where: {
          id: departmentId,
          AND: [
            { organisationId }
          ]
        }
      })
      if (!departmentExist) {
        res.status(404)
        return res.json({message: "No department found", isSuccess: false})
      }
      // TODO provide the organisation ID where the department is to be deleted from 
      await prisma.department.delete({
        where: { 
          id: departmentId,
          AND: [
            { organisationId }
          ]
         },
      });
      res.status(200)
      res.json({ message: 'Department deleted successfully', isSuccess: true });
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400)
        return res.json({ message: err.issues, isSuccess: false });
      }
      res.status(500)
      res.json({ message: 'There was an internal server error', isSuccess: false });
    }
  }

  export default deleteDepartment;