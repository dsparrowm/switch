import { z } from "zod";
import prisma from "../../db";
import { getTaskSchema } from "../../utils/validationSchemas";
import { Request, Response } from 'express'
import redis from "../../redis";

const getTaskById = async (req: Request, res: Response) => {
    try {
      const { taskId } = await getTaskSchema.parseAsync(req.query);
      // const cachedValue = await redis.get(`task:${taskId}`);
      // if (cachedValue) {
      //   res.status(200)
      //   res.json({task: JSON.parse(cachedValue), isSuccess: true})
      //   return
      // }

      const task = await prisma.task.findUnique({
        where: { id: taskId },
      });
      if (!task) {
        res.status(404)
        return res.json({ message: 'Task not found', isSuccess: false });
      }
      // await redis.set(`task:${taskId}`, JSON.stringify(task));
      res.status(200)
      res.json(task);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400)
        return res.json({ message: err.issues, isSuccess: false });
      }
      res.status(500)
      res.json({ message: err.message, isSuccess: false });
    }
}

export default getTaskById;