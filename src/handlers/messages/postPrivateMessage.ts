import { z } from "zod";
import prisma from "../../db";
import { createPrivateMessageSchema } from "../../utils/validationSchemas";
import { Request, Response } from "express";
import redis from "../../redis";

const postPrivateMessage = async (req: Request, res: Response) => {
    try {
      const { senderId, recipientId, content } = await createPrivateMessageSchema.parseAsync(req.body);
      const message = await prisma.message.create({
            data: {
                senderId,
                recipientId,
                content,
            }
        })
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