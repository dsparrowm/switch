import { z } from "zod";
import prisma from "../../db";
import { deleteMessageSchema } from "../../utils/validationSchemas";
import { Request, Response } from "express";
import redis from "../../redis";

const deleteMessage = async (req: Request, res: Response) => {
    try {
        const { messageId } = await deleteMessageSchema.parseAsync(req.query);
        await prisma.message.delete({
            where: {
                id: messageId
            }
        });
        // await redis.del(`message:${messageId}`);
        res.status(200)
        res.json({message: "message deleted successfully", isSuccess: true})
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400)
        return res.json({message: err.issues, isSuccess: false})
      }
        res.status(500)
        res.json({message: err.message, isSuccess: false})
    }
}

export default deleteMessage;