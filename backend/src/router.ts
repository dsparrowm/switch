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
    const {deptId, adminOrDeptHeadId, userEmailToBeAdded, orgId} = req.body;
    try {
        const manager = await prisma.user.findUnique({
            where: {id: adminOrDeptHeadId}, include: {role: true}
        })

        const teamMember = await prisma.user.findUnique({
            where: {email: userEmailToBeAdded}
        })
        if (teamMember === null) {
            if (manager.role.name !== "admin") {
                res.json({message: "The user is not part of this organisation, please contact your admin to add him/her"})
            }
            // implement code here to send him an invitation email to join the organisation
            // To be implemented later
        }
        if (teamMember.organisationId !== orgId) {
            if (manager.role.name !== "admin") {
                res.json({message: "The user is not part of this organisation, please contact your admin to add him/her"})
            }
            // Implement code here to send him an invitation email to join the organisation
            // To be implemented later
        }
        const addedUserToDept = await prisma.user.update({
            where: {
                email: userEmailToBeAdded
            },
            data: {
                departmentId: deptId
            }
        })
        res.status(200).json({message: `User added successfully to department`})

    } catch (err) {
        res.json({error: err.message})
    }
})
router.post('/departments/new', async (req, res) => {
    try {
        const {userId, departmentName, orgId} = req.body;
        console.log("code execution starts here")
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            include: {role: true}
        })
        if (user === null) {
            res.json({message: "User does not exist"})
        }

        if (user.role.name !== "admin") {
            res.json({message: "You do not have the permission to create a department, please contact your Admin"})
        }
        const newDepartment = await prisma.department.create({
            data: {
                name: departmentName,
                organisationId: orgId

            }
        })
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
router.post('/tasks', () => {})
router.put('/tasks/:id', () => {})
router.delete('/tasks/:id', () => {})

/**
 * ORGANISATIONS
 */
router.get('/organisations', (req, res) => {

})
router.get('/organisations/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const getOrg = await prisma.organisation.findUnique({
            where: {
                id: id
            },
            include: {departments: true}
        });
        if (getOrg === null) {
            res.status(400)
            res.json({message: "No organization found", isSuccess: false})
        }
        res.status(200);
        res.json({getOrg, isSuccess: true}) 
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
        const updateUser = await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                roleId: createRole.id,
                organisationId: createOrg.id
            }
        });
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
 * Invite links
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