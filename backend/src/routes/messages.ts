
import { z } from "zod";
import prisma from "../db";
import { Router, Request, Response } from 'express';
import * as messageSchema from "../utils/validationSchemas";


const router = Router();
/**
 * @openapi
 * /api//message/private:
 *   get:
 *     tags:
 *        - Messages
 *     summary: Get private messages between two users.
 *     description: Retrieve private messages between two users based on the provided receiverId and senderId.
 *     parameters:
 *       - in: query
 *         name: receiverId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the message receiver.
 *       - in: query
 *         name: senderId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the message sender.
 *     responses:
 *       '200':
 *         description: Successful response with the retrieved messages.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 messages:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Message'
 *                 isSuccess:
 *                   type: boolean
 *                   description: Indicates if the request was successful.
 *       '404':
 *         description: Error response when the messages are not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message.
 */
router.get('/message/private', async (req: Request, res: Response) => {
    try {
      const { receiverId, senderId } = await messageSchema.getPrivateMessageSchema.parseAsync(req.query); 
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
        return res.status(404).json({message: "No messages found", isSuccess: false})
    }
    const sanitizeMessages = messages.map(message => {
        delete message.sender.password;
        return message
    })
    res.status(200).json({messages: sanitizeMessages, isSuccess: true})
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({message: err.issues, isSuccess: false})
      }
        res.status(404).json({message: err.message})
    }
    
})

/**
 * @openapi
 * /api//message/group:
 *   get:
 *     tags:
 *        - Messages
 *     summary: Get group messages for a specific department.
 *     description: Retrieve group messages for a specific department based on the provided departmentId.
 *     parameters:
 *       - in: query
 *         name: departmentId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the department.
 *     responses:
 *       '200':
 *         description: Successful response with the retrieved messages.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 messages:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Message'
 *                 isSuccess:
 *                   type: boolean
 *                   description: Indicates if the request was successful.
 *       '404':
 *         description: Error response when the messages are not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message.
 */
router.get('/message/group', async (req: Request, res: Response) => {
    try {
      const { departmentId } = await messageSchema.getGroupMessageSchema.parseAsync(req.query);

      const messages = await prisma.message.findMany({
        where: {
            departmentId,
          },
          include: {sender: true},
          orderBy: {createdAt: 'asc'}
      });
      if (!messages.length) {
          return res.status(404).json({message: "No messages found", isSuccess: false})
      }
        res.status(200).json({messages, isSuccess: true})
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({message: err.issues, isSuccess: false})
      }
        res.status(404).json({message: err.message, isSuccess: false})
    } 
})

/**
 * @openapi
 * /api//message/group:
 *   post:
 *     tags:
 *        - Messages
 *     summary: Send a group message to a specific department.
 *     description: Send a group message to a specific department based on the provided senderId, content, and departmentId.
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *            example:
 *              senderId: 1
 *              content: "Hello, everyone!"
 *              departmentId: 1
 *     responses:
 *       '200':
 *         description: Successful response with the sent message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *                message: "message sent successfully"
 *                isSuccess: true
 *       '404':
 *         description: Error response when the message is not sent.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *                message: "message not sent"
 *                isSuccess: false
 */
router.post('/message/group', async (req: Request, res: Response) => {
    try {
      const { senderId, content, departmentId } = await messageSchema.createGroupMessageSchema.parseAsync(req.body);
      const messageSent = await prisma.message.create({
            data: {
                senderId,
                content,
                departmentId,
            }
        })
        const messages = await prisma.message.findUnique({
            where: {
                id: messageSent.id
            },
            include: {sender: true}
        })
        delete messages.sender.password;
        res.status(200).json({message: "message sent successfully", isSuccess: true, messages})
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({message: err.issues, isSuccess: false})
      }  
      res.status(400).json({message: err.message, isSuccess: false})
    }
})

/**
 * @openapi
 * /api//message/private:
 *   post:
 *     tags:
 *        - Messages
 *     summary: Send a private message between two users.
 *     description: Send a private message between two users based on the provided senderId, recipientId, and content.
 *     requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                senderId:
 *                  type: integer
 *                  description: The ID of the message sender.
 *                recipientId:
 *                  type: integer
 *                  description: The ID of the message recipient.
 *                content:
 *                  type: string
 *                  description: The content of the message.
 *     responses:
 *       '200':
 *         description: Successful response with the sent message.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   $ref: '#/components/schemas/Message'
 *                 isSuccess:
 *                   type: boolean
 *                   description: Indicates if the request was successful.
 *       '404':
 *         description: Error response when the message is not sent.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message.
 */
router.post('/message/private', async (req: Request, res: Response) => {
    try {
      const { senderId, recipientId, content } = await messageSchema.createPrivateMessageSchema.parseAsync(req.body);
      const message = await prisma.message.create({
            data: {
                senderId,
                recipientId,
                content,
            }
        })
        res.status(200).json({message, isSuccess: true})
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({message: err.issues, isSuccess: false})
      }
        res.status(404).json({message: err.message})
    }
})

/**
 * @openapi
 * /api/user/messages:
 *   get:
 *     tags:
 *        - Messages
 *     summary: Get chat partners for a specific user.
 *     description: Retrieve chat partners for a specific user based on the provided userId.
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the user.
 *     responses:
 *       '200':
 *         description: Successful response with the chat partners.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 chatPartners:
 *                   type: array
 *                   items:
 *                     type: integer
 *                   description: The IDs of the chat partners.
 *                 isSuccess:
 *                   type: boolean
 *                   description: Indicates if the request was successful.
 *       '404':
 *         description: Error response when the chat partners are not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message.
 */
router.get('/user/messages', async (req: Request, res: Response) => {
  try {
    const { userId } = await messageSchema.getUserMessageSchema.parseAsync(req.query);

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
    res.json(newMessages);
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ message: err.issues, isSuccess: false });
    }
    res.status(500).json({ message: err.message, isSuccess: false });
  }
});

/**
 * @openapi
 * /api/message/{messageId}:
 *   delete:
 *     tags:
 *        - Messages
 *     summary: Delete a message.
 *     description: Delete a private or group messagemessage based on the provided messageId.
 *     parameters:
 *       - in: query
 *         name: messageId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the message to delete.
 *     responses:
 *       '200':
 *         description: Successful response when the message is deleted.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The success message.
 */
router.delete('/message/{messageId}', async (req: Request, res: Response) => {
    const { messageId } = await messageSchema.deletePrivateMessageSchema.parseAsync(req.query);
    try {
        await prisma.message.delete({
            where: {
                id: messageId
            }
        });
        res.status(200).json({message: "message deleted successfully", isSuccess: true})
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({message: err.issues, isSuccess: false})
      }
        res.status(404).json({message: err.message, isSuccess: false})
    }
})

export default router;