import { z } from "zod";
import prisma from "../../db";
import { Request, Response } from 'express';
import { getDepartmentsSchema } from "../../utils/validationSchemas";

const getDepartments = async (req: Request, res: Response) => {
    try {
      const { organisationId } = await getDepartmentsSchema.parseAsync(req.query);
      const departments = await prisma.department.findMany({
        where: { organisationId }
      });
      if (departments.length === 0) {
        res.status(404)
        return res.json({ message: 'No departments found', isSuccess: false });
      }
      res.status(200)
      res.json({ departments, isSuccess: true });
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400)
        return res.json({ message: err.issues, isSuccess: false });
      }
      res.status(500)
      res.json({ message: err.message, isSuccess: false });
    }
  }

  export default getDepartments;