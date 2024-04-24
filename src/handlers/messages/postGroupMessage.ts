import { z } from "zod";
import prisma from "../../db";
import { createGroupMessageSchema } from "../../utils/validationSchemas";
import { Request, Response } from "express";

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
        const messages = await prisma.message.findUnique({
            where: {
                id: messageSent.id
            },
            include: {sender: true}
        })
        
        // delete messages.sender.password;
        res.status(200)
        res.json({message: "message sent successfully", isSuccess: true, messages})
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