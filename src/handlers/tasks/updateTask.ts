import { $Enums, STATUS } from "@prisma/client";
import { z } from "zod";
import prisma from "../../db";
import { updateTaskSchema } from "../../utils/validationSchemas";
import { Request, Response } from 'express';
import redis from "../../redis";

const updateTask = async (req: Request, res: Response) => {
    try {
      const {id, newTitle, description, deadline, assignedTo, status} = await updateTaskSchema.parseAsync(req.body);
      const taskExists = await prisma.task.findUnique({
        where: {id,}
      })
      if (!taskExists) {
        res.status(404)
        return res.json({message: "No task found", isSuccess: false})
      }
      const task = await prisma.task.update({
          where: {id},
          data: {
              title: newTitle,
              description,
              deadline,
              assignedTo,
              status: $Enums.STATUS[status]
          }
      })
        await redis.del(`task:${id}`);
        res.status(200)
        res.json({message: "Task updated successfully", isSuccess: true, task})
    }catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400)
        return res.json({ message: err.issues, isSuccess: false });
      }
      res.status(500)
      res.json({ message: err.message, isSuccess: false });
    }
}

export default updateTask;