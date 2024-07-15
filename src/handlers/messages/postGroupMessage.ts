import { z } from "zod";
import prisma from "../../db";
import { createGroupMessageSchema } from "../../utils/validationSchemas";
import { Request, Response } from "express";
import redis from "../../redis";

const postGroupMessage = async (req: Request, res: Response) => {
    try {
      const { senderId, content, departmentId } = await createGroupMessageSchema.parseAsync(req.body);

      const senderExists = await prisma.user.findUnique({where: {id: senderId}})
      if (!senderExists) {
        res.status(400)
        res.json({message: "Id of this sender does not exist", isSuccess: false})
        return
      }

      const departmentExists = await prisma.department.findUnique({where: {id: departmentId}})
      if (!departmentExists) {
        res.status(404)
        res.json({message: "department does not exist", isSuccess: false})
        return
      }
      const messageSent = await prisma.message.create({
            data: {
                senderId,
                content,
                departmentId,
            }
        })
        const response = await prisma.message.findUnique({
            where: {
                id: messageSent.id
            },
            include: {sender: true}
        })
        const message = {
          id: response.id,
          senderId: response.senderId,
          senderEmail: senderExists.email,
          senderName: senderExists.name,
          departmentId,
          departmentName: departmentExists.name,
          createdAt: response.createdAt,
          updatedAt: response.updatedAt,
          content,
          type: "Group"
        }
        
        // delete messages.sender.password;
        // await redis.del(`department:${departmentId}:messages`);
        res.status(200)
        res.json({status: "message sent successfully", isSuccess: true, message})
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400)
        res.json({message: err.issues, isSuccess: false})
      }  
      res.status(500)
      res.json({message: err.message, isSuccess: false})
    }
}

export default postGroupMessage;