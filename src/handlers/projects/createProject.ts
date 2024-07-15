import prisma from "../../db";
import { Request, Response } from 'express';
import { createProjectSchema } from "../../utils/validationSchemas";
import { z } from "zod";

const createProject = async (req: Request, res: Response) => {
    try {
        const { title, description, organisationId, memberEmails } = await createProjectSchema.parseAsync(req.body);
        const createdBy = req.user.id;
        const result = await prisma.$transaction(async (prisma) => {
            const project = await prisma.project.create({
                data: {
                    title,
                    description,
                    organisationId,
                    createdBy,
                }
            })
            if (memberEmails && memberEmails.length > 0) {
                const users = await prisma.user.findMany({
                    where: {
                        email: {
                            in: memberEmails
                        }
                    }
                })

                const membershipData = users.map(user => ({
                    projectId: project.id,
                    userId: user.id,
                  }));

                await prisma.projectMember.createMany({
                data: membershipData,
                skipDuplicates: true,
                });
            }
            return project;
        })

        res.status(200)
        return res.json({
            message: 'Project created successfully',
            project: result,
        });
    } catch (err) {
        if (err instanceof z.ZodError) {
            res.status(400)
            return res.json({ message: err.issues, isSuccess: false });
        }
        console.error('Error creating project:', err);
        res.status(500)
        res.json({ message: err.message, isSuccess: false });
    }
}

export default createProject;