import prisma from "../../db";
import { Request, Response } from 'express';
import { getProjectSchema } from "../../utils/validationSchemas";
import { z } from "zod";
import { title } from "process";

const getProject = async (req: Request, res: Response) => {
    try {
        const { organisationId } = await getProjectSchema.parseAsync(req.query)
        const userId = req.user.id;
        const projects = await prisma.$transaction(async (prisma) => {
            const user = await prisma.user.findUnique({
                where: {id: userId}
            })
            const result = await prisma.projectMember.findMany({
                where: {
                    AND: [
                        {userId}, {organisationId}
                    ]
                },
                include: {project: true}
            })
            if (!result || result.length < 1) {
                throw Error ('There are no projects for this user')
            }
            const updatedResult = result.map((data) => {
                return {
                    CreatedBy: user.name,
                    ProjectId: data.project.id,
                    Title: data.project.title,
                    Description: data.project.description,
                    CreatedAt: data.project.createdAt,
                    UpdatedAt: data.project.updatedAt,
                    OrganisationId: data.project.organisationId
                }
            })
            return updatedResult
        })
        
        res.status(200)
        res.json({message: "Project(s) found", projects})
    } catch (err) {
        if (err instanceof z.ZodError) {
            res.status(400)
            return res.json({ message: err.issues, isSuccess: false });
        }
        res.status(500)
        res.json({ message: err.message, isSuccess: false });
    }
}

export default getProject;