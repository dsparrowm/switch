import { z } from "zod";
import prisma from "../../db";
import { Request, Response } from 'express';
import { addUserToOrganisationSchema } from "../../utils/validationSchemas";
import redis from "../../redis";

const addOrganisationUsers = async (req: Request, res: Response) => {
    try {
        const {userId, organisationId} = await addUserToOrganisationSchema.parseAsync(req.body);
        const existingEntry = await prisma.userOrganisation.findUnique({
            where: {
                userId_organisationId: {
                    userId,
                    organisationId
                }
            }
        });

        if (!existingEntry) {
           await prisma.userOrganisation.create({
                data: {
                    userId,
                    organisationId
                }
            })
            const departments = await prisma.department.findMany({
                where: {
                    OR: [
                        {
                            AND: [
                                {organisationId},
                                {name: "General"}
                            ]
                        },
                        {
                            AND: [
                                {organisationId, name: "Announcements"},
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

            // await redis.del(`org:${orgId}:users`);
            
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