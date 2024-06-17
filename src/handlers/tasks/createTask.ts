import { z } from "zod";
import prisma from "../../db";
import { createTaskSchema } from "../../utils/validationSchemas";
import { Request, Response } from 'express';
import redis from "../../redis";

const createTask = async (req: Request, res: Response) => {
    try {
        const { title, createdBy } = await createTaskSchema.parseAsync(req.body);
        const task = await prisma.task.create({
        data: {
            title,
            createdBy,
        }
        })
        // await redis.del(`user:${createdBy}:tasks`);
        res.status(200)
        res.json({message: "Task created successfully", isSuccess: true, task})
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400)
        return res.json({ message: err.issues, isSuccess: false });
      }
      res.status(500)
      res.json({ message: err.message, isSuccess: false });
    }
}

export default createTask;