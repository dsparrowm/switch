import { z } from "zod";
import { Request, Response } from 'express';
import prisma from "../../db";
import generateInviteLink from "../../helpers/generateInviteLink";
import { createOrganisationSchema } from "../../utils/validationSchemas";
import redis from "../../redis";
import sendEmail from "../../helpers/sendEmail";
import sendorgInviteLink from "../../helpers/sendOrgInvite";


const createOrganisation = async (req: Request, res: Response) => {
    try {
        const {userId, name, users} = await createOrganisationSchema.parseAsync(req.body);
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

        // send invitation link to users when the organization is created
        if (users) {
            const inviteLink = `${org.inviteLink}`
            const mailOptions = {
                sender: {
                    name: "Swiich",
                    email: 'support@switch.com',
                },
                to: users.map((user) => ({email: user})),
                subject: `Invitation to join ${org.name}`,
                htmlContent: `<p style="color:black;font-size:22px;"><b>Swiich account</b></p><p style="color:blue;letter-spacing:3px;font-size:30px;padding-top: 0px">Invitation to join ${org.name}</p><p>You have been invited to join ${org.name} on Swiich. Click the link below to join</p><a href=${inviteLink}>Join ${org.name}</a><p>If you didn't request this invitation, you can safely ignore this email. Someone else might have typed your email address by mistake.</p><p>Thanks,<br>Swiich account team</p>`,
            }

            // send invitation email to all users
            sendorgInviteLink('Swiich', mailOptions);
        }
        
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