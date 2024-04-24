import { z } from "zod";
import prisma from "../../db";
import { deleteTaskSchema } from "../../utils/validationSchemas";
import { Request, Response } from 'express';

const deleteTask = async (req: Request, res: Response) => {
    try {
      const { taskId } = await deleteTaskSchema.parseAsync(req.query);
      const task = await prisma.task.findUnique({
        where: { id: taskId },
      });
      if (!task) {
        res.status(404)
        return res.json({ message: 'Task not found', isSuccess: false });
      }
      await prisma.task.delete({
        where: { id: taskId },
      });
      res.status(200)
      res.json({ message: 'Task deleted successfully', isSuccess: true });
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400)
        return res.json({ message: err.issues, isSuccess: false });
      }
      res.status(500)
      res.json({ message: err.message, isSuccess: false });
    }
}

export default deleteTask;