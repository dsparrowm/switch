import { z } from "zod";
import { Request, Response } from 'express';
import prisma from "../../db";
import generateInviteLink from "../../helpers/generateInviteLink";
import { createOrganisationSchema } from "../../utils/validationSchemas";
import redis from "../../redis";


const createOrganisation = async (req: Request, res: Response) => {
    try {
        const {userId, name} = await createOrganisationSchema.parseAsync(req.body);
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            }
        })
        if (!user) {
            res.status(404);
            res.json({message: "User does not exist, please create an account"})
            return
        }
        // Create the Organization
        const createOrg = await prisma.organisation.create({
            data: {
                name,
                inviteLink: generateInviteLink()
            }
        });
        
        // Create a new Role called Admin for the user who created the organization
        const createRole = await prisma.role.create({
            data: {
                name: "admin"
            }
        })
        // Update the user by changing his role to admin
        const updateUser = await prisma.userRole.create({
            data: {
                userId,
                roleId: createRole.id,
                organisationId: createOrg.id
            }
        })
        // Create the General and Announcements departments for the organization: These are default departments
        await prisma.department.createMany({
            data: [
                { name: 'General', organisationId: createOrg.id },
                { name: 'Announcements', organisationId: createOrg.id },
            ],
        });
        // Add the Admin to all departments in his organisation
        // First get all the departments in the organisation
        const departments = await prisma.department.findMany({
            where: {organisationId: createOrg.id}
        })
        for (let department of departments) {
            await prisma.userDepartment.create({
                data: {
                    userId,
                    departmentId: department.id
                }
            })
        }
        // Add user to the organisation
        await prisma.userOrganisation.create({
            data: {
                userId,
                organisationId: createOrg.id
            }
        })
        const org = createOrg

        await redis.set(`org:${org.id}`, JSON.stringify(org));
        
        res.status(200);
        res.json({message: 'Organization created successfully!', isSuccess: true, org})
    } catch (err) {
        if (err instanceof z.ZodError) {
            res.status(400);
            res.json({error: err.issues, isSuccess: false})
            return
        }
        res.status(500);
        res.json({error: `${err.message}`, isSuccess: false,})
    }
}

export default createOrganisation;