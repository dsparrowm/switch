import { Router } from 'express';
import sibapiv3sdk from 'sib-api-v3-sdk'
import { sendorgInviteLink } from './handlers/invitelink';

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
router.get('/organisations', () => {})
router.get('/organisations/:id', () => {})
router.post('/organisations', () => {})
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

    try {
        sendorgInviteLink(email, orgName);
        res.status(200);
        res.send("Invite link sent successfully");
    } catch (error) {
        console.log(error);
        res.status(500);
        res.send("Error sending Email");
    }
    
})

export default router;