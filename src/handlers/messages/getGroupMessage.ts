import { z } from "zod";
import prisma from "../../db";
import { getGroupMessageSchema } from "../../utils/validationSchemas";
import { Request, Response } from "express";
import redis from "../../redis";

const getGroupMessage = async (req: Request, res: Response) => {
    try {
      const { departmentId } = await getGroupMessageSchema.parseAsync(req.query);
      const deptExists = await prisma.department.findUnique({where: {id: departmentId}})
      if (!deptExists) {
        res.status(404)
        return res.json({message: "Invalid department Id", isSuccess: false})
      }
      // const cachedMessages = await redis.get(`department:${departmentId}:messages`);
      // if (cachedMessages) {
      //   res.status(200)
      //   res.json({messages: JSON.parse(cachedMessages), isSuccess: true})
      //   return
      // }
      const messages = await prisma.message.findMany({
        where: {
            departmentId,
          },
          include: {sender: true},
          orderBy: {createdAt: 'asc'}
      });
      if (!messages.length) {
          res.status(404)
          return res.json({message: "No messages found", isSuccess: true})
      }
      const response = messages.map(message => {
        const response = {
          id: message.id,
          senderId: message.senderId,
          senderEmail: message.sender.email,
          senderName: message.sender.name,
          departmentId: message.departmentId,
          content: message.content,
          createdAt: message.createdAt,
          updatedAt: message.updatedAt,
      }
      return response
      })
      // await redis.set(`department:${departmentId}:messages`, JSON.stringify(messages));
      res.status(200)
      res.json({response, isSuccess: true})
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400)
        res.json({message: err.issues, isSuccess: false})
      }
        res.status(500)
        res.json({message: err.message, isSuccess: false})
    } 
}

export default getGroupMessage;