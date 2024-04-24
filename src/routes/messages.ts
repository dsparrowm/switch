
import { Router } from 'express';
import postGroupMessage from "../handlers/messages/postGroupMessage";
import getGroupMessage from "../handlers/messages/getGroupMessage";
import getPrivateMessage from "../handlers/messages/getPrivateMessage";
import postPrivateMessage from "../handlers/messages/postPrivateMessage";
import getUserMessages from "../handlers/messages/getUserMessages";
import deleteMessage from '../handlers/messages/deleteMessage';


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
router.get('/message/private', getPrivateMessage)

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
router.get('/message/group', getGroupMessage)

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
router.post('/message/group', postGroupMessage)

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
router.post('/message/private', postPrivateMessage)

/**
 * @openapi
 * /api/user/messages:
 *   get:
 *     tags:
 *        - Messages
 *     summary: Get chat partners for a specific user.
 *     description: Retrieve chat partners and their chat history for a specific user based on the provided userId.
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
router.get('/user/messages', getUserMessages);

/**
 * @openapi
 * /api/messages:
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
router.delete('/messages', deleteMessage)

export default router;