import { Router } from 'express';
import prisma from '../db';
import { create } from 'domain';
import createProject from '../handlers/projects/createProject';
import getProjectById from '../handlers/projects/getProject';

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

router.get('/projects', getProjectById)
router.post('/projects', createProject)
router.post('/projects/users', (req, res) => {})
router.put('/project/:id', (req, res) => {})
router.delete('/project/:id', (req, res) => {})


export default router;