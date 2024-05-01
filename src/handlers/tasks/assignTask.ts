import { z } from "zod";
import prisma from "../../db";
import { assignTaskSchema } from "../../utils/validationSchemas";
import { Request, Response } from 'express';

const assignTask = async (req: Request, res: Response) => {
    try {
      const { taskId, assignedTo } = await assignTaskSchema.parseAsync(req.body);
      const task = await prisma.task.update({
        where: { id: taskId },
        data: {
          assignedTo,
        },
      });
      res.status(200)
      res.json({ message: 'Task assigned successfully', isSuccess: true, });
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400)
        return res.json({ message: err.issues, isSuccess: false });
      }
      res.status(500)
      res.json({ message: err.message, isSuccess: false });
    }
}

export default assignTask;