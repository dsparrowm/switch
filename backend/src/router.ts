import { Router } from 'express';
import sibapiv3sdk from 'sib-api-v3-sdk'
import { sendorgInviteLink } from './handlers/invitelink';
import prisma from './db';

const router = Router();

/**
 * DEPARTMENTS
 */
router.get('/departments', () => {})
router.get('/departments/:id', () => {})
router.post('/departments/join', async (req, res) => {
    const {userIds, adminOrDeptHeadId, departmentId} = req.body;
    try {
        const manager = await prisma.user.findUnique({
            where: {id: adminOrDeptHeadId}, include: {roles: true}
        })
        const addUsersToDept = await prisma.department.update({
            where: {
                id: departmentId
            },
            data: {
                users: {
                    create: userIds.map((id) => ({
                        userId: id
                    })),
                },
            },
        })
        res.status(200).json({message: `User(s) added successfully to department`})

    } catch (err) {
        res.json({error: err.message})
    }
})
router.post('/departments/new', async (req, res) => {
    try {
        const {userId, departmentName, orgId} = req.body;
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            include: {
                roles: {include: {role: true}}
            }
        })
        if (user === null) {
            res.json({message: "User does not exist"})
        }
        if (!user.roles.some(userRole => userRole.role.name === "admin" && userRole.organisationId === orgId)) {
            return res.json({message: "You do not have the permission to create a department, please contact your Admin"});
          }
        const newDepartment = await prisma.department.create({
            data: {
                name: departmentName,
                organisationId: orgId

            }
        })
        const admins = await prisma.userRole.findMany({
            where: {
                role: {
                    name: {
                        equals: "admin"
                    }
                }
            },
            include: {role: true}
        })
        for (let admin of admins) {
            await prisma.userDepartment.create({
                data: {
                    userId: admin.id,
                    departmentId: newDepartment.id
                }
            })
        }
        res.status(200);
        res.json({message: "Department created successfully"})
    } catch (err) {
        console.error(err)
        res.json({error: "Could not reach the database server"})
    }
})
router.put('/departments/:id', () => {})
router.delete('/departments/:id', () => {})

/**
 * TASKS
 */
router.get('/tasks', (req, res) => {
    res.json({message: "Welcome"})
})
router.get('/tasks/:id', () => {})
router.post('/tasks/create', async (req, res) => {
    const {assignedToUserId, taskTitle, description, deadline, deptId} = req.body;
    try {
       const createTask = await prisma.task.create({
        data: {
            title: taskTitle,
            description,
            departmentId: deptId,
            userId: assignedToUserId,
        }
       }) 
    } catch (err) {
        res.status(400).json({message: err.message})
    }
})
router.put('/tasks/:id', () => {})
router.delete('/tasks/:id', () => {})

/**
 * ORGANISATIONS
 */
router.post('/organisations/:id/invitation', async (req, res) => {
    const organisationId = parseInt(req.params.id);
    try {
        //Check if organisation exists
        const organisation = await prisma.organisation.findUnique({
            where: {id: organisationId}
        })
        if (organisation === null) {
            return res.status(400).json({message: "organisation not found"})
        }
        // Delete old invitation if it exists
        const oldInvitation = await prisma.invitation.findUnique({
            where: {organisationId}
        })
        if (oldInvitation) {
            await prisma.invitation.delete({ where: { id: oldInvitation.id } });
        }

        // Generate new unique code for invitation
        const code = Math.random().toString(36).substring(2, 15);

        // Create new invitation
        const newInvitation = await prisma.invitation.create({
            data: {
                code,
                organisationId,
            },
        });

        // Update organisation with new invitationId
        await prisma.organisation.update({
            where: { id: organisationId },
            data: { invitationId: newInvitation.id },
        });

        res.status(200).json({ message: 'Invitation link created successfully!', code, organisationName: organisation.name, isSuccess: true });
    } catch (err) {
        res.status(400).json({message: "An error occurred while creating the invitation link"})
    }
})
router.get('/organisations/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const getOrg = await prisma.organisation.findUnique({
            where: {
                id: id
            },
            include: {
                departments: true,
                users: true
            }
        });
        if (getOrg === null) {
            res.status(400)
            res.json({message: "No organization found", isSuccess: false})
        }
        res.status(200);
        res.json({getOrg, isSuccess: true, NoOfUsers: getOrg.users.length}) 
    } catch (error) {
        res.status(500);
        res.json({error: "Could not reach server", isSuccess: false})
    }
})
router.post('/organisation/new', async (req, res) => {
    const {userId, name} = req.body;
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    })
    if (user === null) {
        res.json({message: "User does not exist, please create an account"})
        return
    }
    try {
        // Create the Organization
        const createOrg = await prisma.organisation.create({
            data: {
                name,
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
        // Create 2 new departments for the organization
        const generalDepartment = await prisma.department.create({
            data: {
                name: "General",
                organisationId: createOrg.id
            }
        });
        const annoucementDepartment = await prisma.department.create({
            data: {
                name: "Announcements",
                organisationId: createOrg.id,
            }
        })
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
        res.status(200);
        res.json({message: 'Organization created successfully!'})
    } catch (err) {
        res.status(500);
        res.json({error: `${err.message}`})
    }
})
router.put('/organisations/:id', () => {})
router.delete('/organisations/:id', () => {})

/**
 * MESSAGES To be implemented later
 */

/**
 * Invitation links
 */
router.post('/:orgName/join', async (req, res) => {
    const orgName = req.body.orgName
    const email = req.body.email

    const receivers = [
        {
            email,
        }
    ];

    const mailOptions = {
        sender: {
            name: "Switch",
            email: 'support@switch.com',
        },
        to: receivers,
        subject: `Invitation to join ${orgName}`,
        htmlContent: `<p>This is a test string</P`
    }

    try {
        sendorgInviteLink(orgName, mailOptions);
        res.status(200);
        res.send("Invite link sent successfully");
    } catch (error) {
        console.log(error);
        res.status(500);
        res.send("Error sending Email");
    }
    
})

export default router;