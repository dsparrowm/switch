import { Router } from 'express';
import prisma from '../db';
import { create } from 'domain';
import createProject from '../handlers/projects/createProject';
import getProjectById from '../handlers/projects/getProjectById';
import addProjectMembers from '../handlers/projects/addProjectMembers';
import getProject from '../handlers/projects/getProject';

/**
 * Express router for handling project-related routes.
 *
 * @remarks
 * This router handles the following routes:
 * - GET /api/projects - Get all projects
 * - GET /api/project/:id - Get a specific project by ID
 * - POST /api/projects - Create a new project
 * - PUT /api/project/:id - Update a project
 * - DELETE /api/project/:id - Delete a project
 *
 * @packageDocumentation
 */

const router = Router();

router.get('/projects', getProject)
router.get('/projects', getProjectById)
router.get('/projects/user, (req, res) => {}')
router.post('/projects', createProject)
router.post('/projects/users', addProjectMembers)
router.put('/projects', (req, res) => {})
router.delete('/projects', (req, res) => {})


export default router;