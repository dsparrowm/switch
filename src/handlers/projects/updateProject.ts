import prisma from "../../db";
import { Request, Response } from 'express';
import { updateProjectSchema } from "../../utils/validationSchemas";
import { z } from "zod";

const updateProject = async (req: Request, res: Response) => {
    try {
        const { title, description, memberEmails, projectId } = await updateProjectSchema.parseAsync(req.body)
        const result = await prisma.$transaction(async (prisma) => {
            // TODO
            //I need to update this endpoint with all properties at once instead of using If statements for all properties
            const updateData: any = {};
            
            if (title !== null && title !== undefined) {
                updateData.title = title;
            }
            
            if (description !== null && description !== undefined) {
                updateData.description = description;
            }
            
            // Update the project
            const updatedProject = await prisma.project.update({
                where: { id: projectId },
                data: updateData,
            });
            // TODO
            //member emails is not complete
            if (memberEmails && memberEmails.length > 0) {
                await prisma.project.update({
                    where: { id: projectId },
                    data: {
                        
                    }
                });
            }

            const projectWithMembers = await prisma.project.findUnique({
                where: { id: projectId },
                include: { members: true }
            });
            
            return projectWithMembers;
            
        })

        res.status(200).json({ message: "Project updated successfully", project: result, isSuccess: true });

    } catch (err) {
        if (err instanceof z.ZodError) {
            res.status(400)
            return res.json({ message: err.issues, isSuccess: false });
        }
        res.status(500).json({ message: "An error occurred while updating the project", isSuccess: false });
    }
}

export default updateProject;