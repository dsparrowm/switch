import { z } from "zod";
import prisma from "../../db";
import { createPrivateMessageSchema } from "../../utils/validationSchemas";
import { Request, Response } from "express";
import redis from "../../redis";

const postPrivateMessage = async (req: Request, res: Response) => {
    try {
      const { senderId, recipientId, content } = await createPrivateMessageSchema.parseAsync(req.body);
      const senderExists = await prisma.user.findUnique({
        where: {
          id: senderId
        }
      })
      if (!senderExists) {
        res.send("No user matching the sender's Id")
        return
      }
      const receiverExists = await prisma.user.findUnique({
        where: {id: recipientId}
      })
      if (!receiverExists) {
        res.send("No user with the recipient's Id")
        return
      }
      const response = await prisma.message.create({
            data: {
                senderId,
                recipientId,
                content,
            }
        })
        const message = {
          id: response.id,
          senderId: response.senderId,
          senderEmail: senderExists.email,
          senderName: senderExists.name,
          recipientId,
          recipientName: receiverExists.name,
          recipientEmail: receiverExists.email,
          createdAt: response.createdAt,
          updatedAt: response.updatedAt,
          content,
          type: "Private"
        }
        // await redis.del(`user:${senderId}:messages:${recipientId}`);
        res.status(200)
        res.json({message, isSuccess: true})
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400)
        res.json({message: err.issues, isSuccess: false})
      }
        res.status(500)
        res.json({message: err.message, isSuccess: false})
    }
}

export default postPrivateMessage;