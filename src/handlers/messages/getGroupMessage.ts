import { z } from "zod";
import prisma from "../../db";
import { getGroupMessageSchema } from "../../utils/validationSchemas";
import { Request, Response } from "express";

const getGroupMessage = async (req: Request, res: Response) => {
    try {
      const { departmentId } = await getGroupMessageSchema.parseAsync(req.query);

      const messages = await prisma.message.findMany({
        where: {
            departmentId,
          },
          include: {sender: true},
          orderBy: {createdAt: 'asc'}
      });
      if (!messages.length) {
          res.status(404)
          return res.json({message: "No messages found", isSuccess: false})
      }
        res.status(200)
        res.json({messages, isSuccess: true})
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