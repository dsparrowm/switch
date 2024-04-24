import { z } from "zod";
import prisma from "../../db";
import { unAssignTaskSchema } from "../../utils/validationSchemas";
import { Request, Response } from "express";

const unAssignTask = async (req: Request, res: Response) => {
    try {
      const { taskId } = await unAssignTaskSchema.parseAsync(req.body)
      const task = await prisma.task.findUnique({
        where: { id: taskId },
      });
      if (!task) {
        res.status(404)
        return res.json({ message: 'Task not found', isSuccess: false });
      }
      await prisma.task.update({
        where: { id: taskId },
        data: {
          assignedTo: null,
        },
      });
      res.status(200)
      res.json({ message: 'Task unassigned successfully', isSuccess: true });
      
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400)
        return res.json({ message: err.issues, isSuccess: false });
      }
      res.status(500)
      res.json({ message: err.message, isSuccess: false });
    }
}

export default unAssignTask;