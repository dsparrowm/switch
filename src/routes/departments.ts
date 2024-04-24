import { z } from "zod";
import prisma from "../db";
import { Router, Request, Response } from 'express';
import * as departmentSchema from "../utils/validationSchemas";
import getDepartments from "../handlers/departments/getDepartments";
import getDepartmentById from "../handlers/departments/getDepartmentById";
import addDepartmentUsers from "../handlers/departments/addDepartmentUsers";
import createDepartment from "../handlers/departments/createDepartment";
import updateDepartment from "../handlers/departments/updateDepartment";
import deleteDepartment from "../handlers/departments/deleteDepartment";

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
router.get('/departments', getDepartments);

/**
 * @openapi
 * /api/department/id:
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
router.get('/department/id', getDepartmentById);

/**
 * @openapi
 * /api/department/users:
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
router.post('/department/users', addDepartmentUsers);

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
router.post('/department/create', createDepartment);
  
router.put('/departments', updateDepartment)

router.delete('/departments', deleteDepartment)

export default router;