import { z } from "zod";
import prisma from "../../db";
import { getUserTaskSchema } from "../../utils/validationSchemas";
import { Request, Response } from 'express';

const getTasks = async (req: Request, res: Response) => {
    try {
      const { userId } = await getUserTaskSchema.parseAsync(req.query);
      const tasks = await prisma.task.findMany({
        where: {
          OR: [
            { createdBy: userId },
            { assignedTo: userId }
          ]
        }
      });
      if (tasks.length === 0) {
        res.status(404)
        return res.json({ message: 'No tasks found', isSuccess: false });
      }
      res.status(200)
      res.json(tasks);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400)
        return res.json({ message: err.issues, isSuccess: false });
      }
      console.error(err);
      res.status(500)
      res.json({ message: err.message, isSuccess: false });
    }
    
}

export default getTasks;