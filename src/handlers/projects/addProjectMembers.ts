import prisma from "../../db";
import { Request, Response } from 'express';
import { addProjectMembersSchema } from "../../utils/validationSchemas";
import { z } from "zod";

const addProjectMembers = async (req: Request, res: Response) => {
    try {
        const { projectId, memberEmails} = await addProjectMembersSchema.parseAsync(req.body);
        const project = await prisma.project.findUnique({
            where: {
                id: projectId
            }
        });
        if (!project) {
            res.status(404)
            return res.json({ message: 'Project not found', isSuccess: false });
        }
        const members = await prisma.user.findMany({
            where: {
                email: {
                    in: memberEmails
                }
            }
        });
        if (members.length === 0 || members.length !== memberEmails.length) {
            res.status(404)
            return res.json({ message: 'One or more emails do not match any user', isSuccess: false });
        }
        const projectMembers = members.map((member) => ({
            projectId,
            userId: member.id,
        }))
        await prisma.projectMember.createMany({
            data: projectMembers,
            skipDuplicates: true
        })
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400)
        return res.json({ message: err.issues, isSuccess: false });
      }
      res.status(500)
      return res.json({ message: 'Internal Server Error', isSuccess: false });  
    }
}

export default addProjectMembers;