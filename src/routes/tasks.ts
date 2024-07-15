import { z } from "zod";
import prisma from "../db";
import { Router, Request, Response } from 'express';
import * as taskSchema from "../utils/validationSchemas";
import { STATUS } from "@prisma/client";
import getTasks from "../handlers/tasks/getTasks";
import getTaskById from "../handlers/tasks/getTaskById";
import createTask from "../handlers/tasks/createTask";
import assignTask from "../handlers/tasks/assignTask";
import updateTask from "../handlers/tasks/updateTask";
import deleteTask from "../handlers/tasks/deleteTask";
import unAssignTask from "../handlers/tasks/unAssignTask";

/**
 * Express router for handling tasks-related routes.
 *
 * @remarks
 * This router handles the following routes:
 * - GET /api/tasks - Get all tasks
 * - GET /api/task/{id} - Get a specific task by ID
 * - POST /api/tasks - Create a new task
 * - PUT /api/task/{id} - Update a task
 * - DELETE /api/tasks/{id} - Delete a task
 *
 * @packageDocumentation
 */


const router = Router();

/**
 * @openapi
 * /api/tasks:
 *   get:
 *     tags:
 *        - Tasks
 *     summary: Get all tasks
 *     description: Get all tasks created by or assigned to a user using the user's ID
 *     parameters:
 *      - in: query
 *        name: userId
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
 *                                $ref: '#/components/schemas/TasksResponse'
 *                      example:
 *                        [{"id":1,"title":"Task 1","description":"Task 1 description","deadline":"2021-09-30T00:00:00.000Z","status":"IN PROGRESS","createdBy":1,"assignedTo":1}]
 *                              
 *        400:
 *            description: Bad Request
 *            content:
 *                    application/json:
 *                      schema:
 *                              type: object
 *                              items:
 *                                $ref: '#/components/schemas/ErrorResponse'
 *                      example:
 *                        {"message": "Invalid input", "isSuccess": false}
 * 
 * 
 */
router.get('/tasks', getTasks)

/**
 * @openapi
 * /api/task/id:
 *   get:
 *     tags:
 *        - Tasks
 *     summary: Get a specific task by ID
 *     description: Get a specific task by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *        200:
 *            description: Successful response.
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/TaskResponse'
 *                example:
 *                  {
 *                    "id": 1,
 *                    "title": "Task 1",
 *                    "description": "Task 1 description",
 *                    "deadline": "2021-09-30T00:00:00.000Z",
 *                    "status": "IN PROGRESS",
 *                    "createdBy": 1,
 *                    "assignedTo": 1
 *                  }
 *        404:
 *            description: Task not found
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/ErrorResponse'
 *                example:
 *                  {
 *                    "message": "Task not found",
 *                    "isSuccess": false
 *                  }
 *        400:
 *            description: Bad Request
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/ErrorResponse'
 *                example:
 *                  {
 *                    "message": "Invalid input",
 *                    "isSuccess": false
 *                  }
 *        500:
 *            description: Internal Server Error
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/ErrorResponse'
 *                example:
 *                  {
 *                    "message": "There was an issue with the database connection",
 *                    "isSuccess": false
 *                  }
 */
router.get('/task/id', getTaskById);


/**
 * @openapi
 * /api/tasks:
 *   post:
 *     tags:
 *        - Tasks
 *     summary: Create a new task
 *     description: Create a new task with the provided title and createdBy values
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTaskRequest'
 *           example:
 *             {
 *               "title": "ui for Dashboard",
 *               "createdBy": 1
 *             }
 *     responses:
 *        200:
 *            description: Successful response.
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/CreateTaskResponse'
 *                example:
 *                  {
 *                    "message": "Task created successfully",
 *                    "isSuccess": true,
 *                    "task": {
 *                      "id": 1,
 *                      "title": "Task 1",
 *                      "description": null,
 *                      "deadline": null,
 *                      "status": null,
 *                      "createdBy": 1,
 *                      "assignedTo": null
 *                    }
 *                  }
 *        400:
 *            description: Bad Request
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/ErrorResponse'
 *                example:
 *                  {
 *                    "message": "Invalid input",
 *                    "isSuccess": false
 *                  }
 *        500:
 *            description: Internal Server Error
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/ErrorResponse'
 *                example:
 *                  {
 *                    "message": "There was an issue with the database connection",
 *                    "isSuccess": false
 *                  }
 */
router.post('/tasks', createTask)


/**
 * @openapi
 * /api/tasks:
 *   put:
 *     tags:
 *        - Tasks
 *     summary: Update a task
 *     description: Update a task with the provided task ID and new task details
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTaskRequest'
 *           example:
 *             {
 *               "id": 1,
 *               "newTitle": "Updated Task Title",
 *               "description": "Updated Task Description",
 *               "dueDate": "2022-01-01",
 *               "assignedTo": 2,
 *               "status": "IN PROGRESS"
 *             }
 *     responses:
 *        200:
 *            description: Successful response.
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/UpdateTaskResponse'
 *                example:
 *                  {
 *                    "message": "Task updated successfully",
 *                    "isSuccess": true,
 *                    "task": {
 *                      "id": 1,
 *                      "title": "Updated Task Title",
 *                      "description": "Updated Task Description",
 *                      "deadline": "2022-01-01T00:00:00.000Z",
 *                      "status": "IN PROGRESS",
 *                      "createdBy": 1,
 *                      "assignedTo": 2
 *                    }
 *                  }
 *        400:
 *            description: Bad Request
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/ErrorResponse'
 *                example:
 *                  {
 *                    "message": "Invalid input",
 *                    "isSuccess": false
 *                  }
 *        500:
 *            description: Internal Server Error
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/ErrorResponse'
 *                example:
 *                  {
 *                    "message": "There was an issue with the database connection",
 *                    "isSuccess": false
 *                  }
 */
router.put('/tasks', updateTask)

/**
 * @openapi
 * /api/task/assignUsers:
 *  post:
 *      tags:
 *        - Tasks
 *      summary: Assign user(s) to a task
 *      description: Assign user(s) to a task with the provided task ID and user IDs
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/AssignTaskRequest'
 *            example:
 *              {
 *                "taskId": 1,
 *                "assignedTo": 2
 *              }
 *      responses:
 *        200:
 *          description: Successful response.
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/AssignTaskResponse'
 *              example:
 *                {
 *                  "message": "Task assigned successfully",
 *                }
 *        400:
 *          description: Bad Request
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 *              example:
 *                {
 *                  "message": "Invalid input",
 *                }
 *        500:
 *          description: Internal Server Error
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/ErrorResponse'
 *              example:
 *                {
 *                  "message": "There was an issue with the database connection",
 *                  "isSuccess": false
 *                }
 */
router.post('/task/assignUsers', assignTask);


/**
 * @openapi
 * /api/task/taskId/unAssign:
 *  put:
 *      tags:
 *        - Tasks
 *      summary: Unassign a task
 *      description: Unassign a task from a user with the provided task ID
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *            example:
 *              {
 *                "taskId": 1,
 *                "userId": 2
 *              }
 *      responses:
 *          200:
 *              description: Successful response.
 *              content:
 *                application/json:
 *                  schema:
 *                    $ref: '#/components/schemas/UnassignTaskResponse'
 *                  example:
 *                    {
 *                      "message": "Task unassigned successfully",
 *                    }
 *          400:
 *            description: Bad Request
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/ErrorResponse'
 *                example:
 *                  {
 *                    "message": "Invalid input",
 *                    "isSuccess": false
 *                  }
 *          404:
 *            description: Task not found
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/ErrorResponse'
 *                example:
 *                  {
 *                    "message": "Task not found",
 *                    "isSuccess": false
 *                  }
 */
router.put('/task/taskId/unAssign', unAssignTask)

/**
 * @openapi
 * /api/tasks:
 *   delete:
 *     tags:
 *        - Tasks
 *     summary: Delete a task
 *     description: Delete a task with the provided task ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *        200:
 *            description: Successful response.
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/DeleteTaskResponse'
 *                example:
 *                  {
 *                    "message": "Task deleted successfully",
 *                    "isSuccess": true
 *                  }
 *        400:
 *            description: Bad Request
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/ErrorResponse'
 *                example:
 *                  {
 *                    "message": "Invalid input",
 *                    "isSuccess": false
 *                  }
 *        500:
 *            description: Internal Server Error
 *            content:
 *              application/json:
 *                schema:
 *                  $ref: '#/components/schemas/ErrorResponse'
 *                example:
 *                  {
 *                    "message": "There was an issue with the database connection",
 *                    "isSuccess": false
 *                  }
 */
router.delete('/tasks', deleteTask);

export default router;