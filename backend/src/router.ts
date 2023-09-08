import { Router } from 'express';

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

export default router;