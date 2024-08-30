import prisma from "../../db";
import { Request, Response } from 'express';
import { getProjectByIdSchema } from "../../utils/validationSchemas";
import { z } from "zod";

const getProjectById = async (req: Request, res:Response ) => {
    try {
        const { projectId } = await getProjectByIdSchema.parseAsync(req.query);
        const project = await prisma.project.findUnique({
            where: { 
                id: projectId
            },
            include: {
                tasks: true,
                members: true
            }
        });
        if (!project) {
            res.status(404)
            return res.json({ message: 'Project not found', isSuccess: false });
        }
        res.status(200)
        return res.json({ message: 'Found', project, isSuccess: true });
    } catch (err) {
        if (err instanceof z.ZodError) {
            res.status(400)
            return res.json({ message: err.issues, isSuccess: false });
        }
        
        res.status(500)
        return res.json({ message: 'Internal Server Error', isSuccess: false });
    }
}

export default getProjectById;