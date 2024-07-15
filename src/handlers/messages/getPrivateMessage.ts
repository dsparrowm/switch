import { z } from "zod";
import prisma from "../../db";
import { getPrivateMessageSchema } from "../../utils/validationSchemas";
import { Request, Response } from "express";
import redis from '../../redis'

const getPrivateMessage = async (req: Request, res: Response) => {
    try {
      const { receiverId, senderId } = await getPrivateMessageSchema.parseAsync(req.query);
      const senderExists = await prisma.user.findUnique ({
        where: {id: senderId}
      })
      if (!senderExists) {
        res.send(`No user with Id of ${senderId}`)
        return
      }
      const receiverExists = await prisma.user.findUnique ({
        where:  {id: receiverId}
      })
      if (!receiverExists) {
        res.send(`No user with Id of ${receiverId}`)
        return
      }
    //   const cachedMessage =  await redis.get(`user:${senderId}:messages:${receiverId}`);
    //   if (cachedMessage) {
    //     res.status(200)
    //     return res.json({messages: JSON.parse(cachedMessage), isSuccess: true})
    //   }
      const messages = await prisma.message.findMany({
        where: {
            OR: [
            {
                AND: [
                { senderId: senderId },
                { recipientId: receiverId }
                ]
            },
            {
                AND: [
                { senderId: receiverId },
                { recipientId: senderId }
                ]
            }
            ]
        },
        include: {sender: true},
        orderBy: {
            createdAt: 'asc'
        }
    });
    if (!messages.length) {
        res.status(404)
        return res.json({message: "No messages found", isSuccess: false})
    }
    const sanitizedMessages = messages.map(message => {
        const response = {
            id: message.id,
            senderId: message.senderId,
            senderEmail: senderExists.email,
            senderName: senderExists.name,
            receiverId,
            receiverName: receiverExists.name,
            receiverEmail: receiverExists.email,
            content: message.content,
            createdAt: message.createdAt,
            updatedAt: message.updatedAt,
        }
        return response
    })
    // await redis.set(`user:${senderId}:messages:${receiverId}`, JSON.stringify(sanitizedMessages));
    res.status(200)
    res.json({messages: sanitizedMessages, isSuccess: true})
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400)
        return res.json({message: err.issues, isSuccess: false})
      }
     res.status(500)
     res.json({message: err.message, isSuccess: false})
    }   
}

export default getPrivateMessage;