import { z } from "zod";
import prisma from "../../db";
import { Request, Response } from 'express';
import { addUserToOrganisationSchema } from "../../utils/validationSchemas";

const addOrganisationUsers = async (req: Request, res: Response) => {
    try {
        const {userId, orgId} = await addUserToOrganisationSchema.parseAsync(req.body);
        const existingEntry = await prisma.userOrganisation.findUnique({
            where: {
                userId_organisationId: {
                    userId,
                    organisationId: orgId
                }
            }
        });

        if (!existingEntry) {
           await prisma.userOrganisation.create({
                data: {
                    userId,
                    organisationId: orgId
                }
            })
            const departments = await prisma.department.findMany({
                where: {
                    OR: [
                        {
                            AND: [
                                {organisationId: orgId},
                                {name: "General"}
                            ]
                        },
                        {
                            AND: [
                                {organisationId: orgId, name: "Announcements"},
                            ]
                        }
                    ]
                }  
            })
            for (let department of departments) {
                await prisma.userDepartment.create({
                    data: {
                        userId,
                        departmentId: department.id
                    }
                })
            }
            res.status(200)
            res.json({message: "User added successfully", isSuccess: true})
        } else {
            res.status(400)
            res.json({message: "User already exists in the organisation", isSuccess: false})
        }
    } catch (err) {
        if (err instanceof z.ZodError) {
            res.status(400)
            res.json({message: err.issues, isSuccess: false})
            return
        }
        res.status(500)
        res.json({message: err.message, isSuccess: false})
    }
}

export default addOrganisationUsers;