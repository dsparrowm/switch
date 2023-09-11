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
router.post('/departments', () => {})
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
router.get('/organisations', (req, res) => {})
router.get('/organisations/:id', () => {})
router.post('/organisation/new', async (req, res) => {
    const {userId, name} = req.body;
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
    } catch (error) {
        res.status(500);
        res.json({error: `${error}`})
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