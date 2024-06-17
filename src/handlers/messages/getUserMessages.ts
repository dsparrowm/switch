import { z } from "zod";
import prisma from "../../db";
import { getUserMessageSchema } from "../../utils/validationSchemas";
import { Request, Response } from "express";
import redis from '../../redis'

const getUserMessages = async (req: Request, res: Response) => {
    try {
      const { userId } = await getUserMessageSchema.parseAsync(req.query);
      // const cachedValue = await redis.get(`user:${userId}:messages`);
      // if (cachedValue) {
      //   res.status(200)
      //   res.json({messages: JSON.parse(cachedValue), isSuccess: true})
      //   return
      // }
      // Get all chatPartners that the given user has sent messages to or received messages from
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: userId },
            { recipientId: userId },
          ],
        },
        select: {
          senderId: true,
          recipientId: true,
        },
      });
  
      const chatPartners = Array.from(new Set(messages.flatMap(({ senderId, recipientId }) => [
          senderId === userId ? recipientId : senderId,
        ].filter(Boolean))));
        
  
      // Get the last message sent or received between the given user and each chat partner
      const lastMessagesPromises = chatPartners.map(async partnerId => {
        return await prisma.message.findFirst({
          where: {
            OR: [
              { AND: [{ senderId: userId }, { recipientId: partnerId }] },
              { AND: [{ senderId: partnerId }, { recipientId: userId }] },
            ],
          },
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            sender: true,
            recipient: true,
          },
        });
      });
  
      let lastMessages = await Promise.all(lastMessagesPromises);
      // Sort conversations by the timestamp of the last message
      lastMessages = lastMessages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      const newMessages = lastMessages.map(message => {
        delete message.sender.password;
        delete message.recipient.password;
        return message
      })
      // await redis.set(`user:${userId}:messages`, JSON.stringify(newMessages))
      res.status(200)
      res.json(newMessages);
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400)
        return res.json({ message: err.issues, isSuccess: false });
      }
      res.status(500)
      res.json({ message: err.message, isSuccess: false });
    }
}

export default getUserMessages;