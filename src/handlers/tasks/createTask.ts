import { z } from "zod";
import prisma from "../../db";
import { createTaskSchema } from "../../utils/validationSchemas";
import { Request, Response } from 'express';
import redis from "../../redis";

const createTask = async (req: Request, res: Response) => {
    try {
        const { title, description, assignedUsers, deadline, checklists, projectId } = await createTaskSchema.parseAsync(req.body);
        const createdBy = req.user.id

        const result = await prisma.$transaction( async (prisma) => {
          // create the task
          const task = await prisma.task.create({
            data: {
              title,
              description,
              deadline: deadline ? new Date(deadline) : undefined,
              createdBy,
              projectId: projectId || undefined,
            },
          });

          if (assignedUsers && assignedUsers.length > 0) {
            const users = await prisma.user.findMany({
              where: {
                email: {
                  in: assignedUsers,
                },
              },
            });

            await prisma.taskAssignee.createMany({
              data: users.map(user => ({
                taskId: task.id,
                userId: user.id,
              })),
              skipDuplicates: true,
            });
          }

          // create checklists
          if (checklists && checklists.length > 0) {
            await prisma.checklist.createMany({
              data: checklists.map(item => ({
                title: item.title,
                taskId: task.id,
                assignedTo: item.assignedTo ? item.assignedTo : undefined,
              })),
            });
          }
          // fetch the created task with it's relations
          return prisma.task.findUnique({
            where: { id: task.id },
            include: {
              assignedUser: true,
              project: true,
              checklists: {
                include: {
                  assignee: true,
                },
              },
              assignees: {
                include: { user: true },
              },
            },
          });
        })
        // await redis.del(`user:${createdBy}:tasks`);
        res.status(200)
        res.json({
          message: 'Task created successfully',
          task: result,
        });
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