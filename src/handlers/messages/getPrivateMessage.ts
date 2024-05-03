import { z } from "zod";
import prisma from "../../db";
import { getPrivateMessageSchema } from "../../utils/validationSchemas";
import { Request, Response } from "express";

const getPrivateMessage = async (req: Request, res: Response) => {
    try {
      const { receiverId, senderId } = await getPrivateMessageSchema.parseAsync(req.query); 
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
    // const sanitizeMessages = messages.map(message => {
    //     delete message.sender.password;
    //     return message
    // })
    res.status(200)
    res.json({messages: messages, isSuccess: true})
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