import { z } from "zod";
import prisma from "../db";
import { Router, Request, Response } from 'express';
import * as departmentSchema from "../utils/validationSchemas";

/**
 * Express router for handling departments-related routes.
 *
 * @remarks
 * This router handles the following routes:
 * - GET /api/departments - Get all departments
 * - GET /api/department/:id - Get a specific department by ID
 * - POST /api/department/create - Create a new departmnent
 * - POST /api/department/join - add user(s) to a department
 * - PUT /api/department/:id - update a department
 * - DELETE /api/department/:id - Delete a department
 *
 * @packageDocumentation
 */

//Departments router instance
const router = Router();

/**
 * @openapi
 * /api/departments:
 *   get:
 *     tags:
 *        - Departments
 *     summary: Retrieve a list of all departments within an organization
 *     parameters:
 *      - in: query
 *        name: orgId
 *        required: true
 *        schema:
 *          type: integer
 *     responses:
 *        200:
 *            description: Successful response.
 *            content:
 *                    application/json:
 *                      schema:
 *                              type: array
 *                              items:
 *                                $ref: '#/components/schemas/Department'
 *                      example:
 *                              [{"id":1,"name":"HR","organisationId":1,"createdAt":"2021-08-25T14:00:00.000Z","updatedAt":"2021-08-25T14:00:00.000Z"}, {"id":2,"name":"Finance","organisationId":1,"createdAt":"2021-08-25T14:00:00.000Z","updatedAt":"2021-08-25T14:00:00.000Z"}]
 *                              
 *        400:
 *            description: No departments found
 *            content:
 *                    application/json:
 *                      schema:
 *                              type: object
 *                              items:
 *                                $ref: '#/components/schemas/ErrorResponse'
 *                      example:
 *                              {"message":"No departments found","isSuccess":false}
 * 
 * 
 */
router.get('/departments', async (req: Request, res: Response) => {
    try {
      const { orgId } = await departmentSchema.getDepartmentsSchema.parseAsync(req.query);
      const departments = await prisma.department.findMany({
        where: { organisationId: parseInt(orgId) }
      });
      if (departments.length === 0) {
        return res.status(404).json({ message: 'No departments found', isSuccess: false });
      }
      res.status(200).json({ departments, isSuccess: true });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.issues, isSuccess: false });
      }
      res.status(400).json({ message: err.message, isSuccess: false });
    }
  });

/**
 * @openapi
 * /api/department/:id:
 *   get:
 *     tags:
 *        - Departments
 *     summary: Retrieve information about a department using it's ID
 *     parameters:
 *      - in: query
 *        name: departmentId
 *        required: true
 *        schema:
 *          type: integer
 *     responses:
 *      200:
 *       description: Successful response.
 *       content:
 *        application/json:
 *         schema:
 *          type: object
 *          properties:
 *           department:
 *            $ref: '#/components/schemas/Department'
 *           isSuccess:
 *            type: boolean
 *      400:
 *        description: No department found
 *        content:
 *          application/json:
 *            schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *            example:
 *              message: No department found
 *              isSuccess: false
 *      404:
 *        description: Error.
 *        content:
 *          application/json:
 *           schema:
 *            $ref: '#/components/schemas/ErrorResponse'
 *           example:
 *            message: An Error occurred
 *            isSuccess: false
 */
router.get('/department/:id', async (req: Request, res: Response) => {
    try {
      const { departmentId } = await departmentSchema.getDepartmentSchema.parseAsync(req.query);
      const department = await prisma.department.findUnique({
        where: { id: departmentId },
        include: {
          messages: {
            orderBy: {
              createdAt: 'asc',
            },
          },
        },
      });
  
      if (!department) {
        return res.status(400).json({ message: 'No department found', isSuccess: false });
      }
  
      res.status(200).json({ department, isSuccess: true });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.issues, isSuccess: false });
      }
      res.status(404).json({ message: err.message, isSuccess: false });
    }
  });

/**
 * @openapi
 * /api/department/join:
 *  post:
 *   tags:
 *      - Departments
 *   summary: Add users to a department
 *   requestBody:
 *    content:
 *      application/json:
 *        schema:
 *          $ref: '#/components/schemas/JoinDepartmentRequest'
 *        example:
 *          userIds: [2, 3]
 *          adminOrDeptHeadId: 13
 *          departmentId: 9
 *   responses:
 *    200:
 *     description: User(s) added successfully to department
 *     content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/SuccessResponse'
 *        example:
 *         message: User(s) added successfully to department
 *         isSuccess: true
 *    400:
 *     description: Bad Request.
 *     content:
 *      application/json:
 *       schema:
 *         $ref: '#/components/schemas/ErrorResponse'
 *       example:
 *         message: An error occurred with your request
 *         isSuccess: false
 *    403:
 *      description: Unauthorized
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *          example:
 *            message: You don't have permission to add users to this department
 *            isSuccess: false
 * 
 */
router.post('/department/join', async (req: Request, res: Response) => {
  try {
    const { userIds, adminOrDeptHeadId, departmentId } = await departmentSchema.joinDepartmentSchema.parseAsync(req.body);

    const manager = await prisma.user.findUnique({
      where: { id: adminOrDeptHeadId },
      include: { roles: true },
    });
    
      // make sure the user is a manager of the department
    if (!manager || !manager.roles.some((role) => role.roleId === 1)) {
      return res.status(403).json({ message: 'You do not have permission to add users to this department', isSuccess: false });
    }

    await prisma.department.update({
      where: { id: departmentId },
      data: {
        users: {
          create: userIds.map((id) => ({ userId: id })),
        },
      },
    });

    res.status(200).json({ message: 'User(s) added successfully to department', isSuccess: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ message: err.issues, isSuccess: false });
    }
    res.status(400).json({ error: err.message, isSuccess: false });
  }
});

/**
 * @openapi
 * /api/department/create:
 *  post:
 *      tags:
 *          - Departments
 *      summary: Create a new department
 *      description: This endpoint creates a new department withing an organization
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              items:
 *                $ref: '#/components/schemas/createDepartmentRequest'
 *            example:
 *              userId: 3
 *              departmentId: 2
 *              orgId: 14
 *      responses:
 *        200:
 *          description: Department created successfully
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/SuccessResponse'
 *              example:
 *                message: Department created successfully
 *                isSuccess: true
 *        400:
 *          description: Bad Request.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 *              example:
 *                message: An error occurred with your request
 *                isSuccess: false
 *        403:
 *          description: Unauthorized
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *              example:
 *                message: You don't have permission to create a department
 *                isSuccess: false
 *        500:
 *          description: Server error
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 *              example:
 *                message: There was an internal server error
 *                isSuccess: false
 * 
 */
router.post('/department/create', async (req: Request, res: Response) => {
  try {
    const { userId, departmentName, orgId } = await departmentSchema.createDepartmentSchema.parseAsync(req.body);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { roles: { include: { role: true } } },
    });

    if (!user) {
      return res.status(404).json({ message: 'User does not exist', isSuccess: false });
    }

    if (!user.roles.some((userRole) => userRole.role.name === 'admin' && userRole.organisationId === orgId)) {
      return res.status(403).json({ message: 'You do not have permission to create a department', isSuccess: false });
    }

    const newDepartment = await prisma.department.create({
      data: {
        name: departmentName,
        organisationId: orgId,
      },
    });

    const admins = await prisma.userRole.findMany({
      where: { role: { name: 'admin' } },
      include: { role: true },
    });

    for (const admin of admins) {
      await prisma.userDepartment.create({
        data: {
          userId: admin.id,
          departmentId: newDepartment.id,
        },
      });
    }
  
      res.status(200).json({ message: 'Department created successfully', isSuccess: true });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.issues, isSuccess: false });
      }
      console.error(err);
      res.status(500).json({ message: 'There was an internal server error', isSuccess: false });
    }
  });
  
router.put('/department/{id}', async (req: Request, res: Response) => {
  try {
    const { id, departmentName } = await departmentSchema.updateDepartmentSchema.parseAsync(req.body);
    const updatedDepartment = await prisma.department.update({
      where: { id, },
      data: { name: departmentName },
    });

    res.status(200).json({ message: 'Department updated successfully', isSuccess: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ message: err.issues, isSuccess: false });
    }
    res.status(500).json({ message: 'There was an internal server error', isSuccess: false });
  }
})
router.delete('/department/:id', async (req: Request, res: Response) => {
  try {
    const { departmentId } = await departmentSchema.deleteDepartmentSchema.parseAsync(req.query);
    await prisma.department.delete({
      where: { id: departmentId },
    });
    res.status(200).json({ message: 'Department deleted successfully', isSuccess: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ message: err.issues, isSuccess: false });
    }
    res.status(500).json({ message: 'There was an internal server error', isSuccess: false });
  }
})

export default router;