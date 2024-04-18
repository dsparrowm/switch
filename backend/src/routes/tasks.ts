import { z } from "zod";
import prisma from "../db";
import { Router, Request, Response } from 'express';
import * as taskSchema from "../utils/validationSchemas";
import { STATUS } from "@prisma/client";

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
router.get('/tasks', async (req: Request, res: Response) => {
  try {
    const { userId } = await taskSchema.getUserTaskSchema.parseAsync(req.query);
    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          { createdBy: userId },
          { assignedTo: userId }
        ]
      }
    });
    if (tasks.length === 0) {
      return res.status(404).json({ message: 'No tasks found', isSuccess: false });
    }
    res.status(200).json(tasks);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ message: err.issues, isSuccess: false });
    }
    console.error(err);
    res.status(500).json({ message: 'There was an issue with the database connection', isSuccess: false });
  }
  
  })

/**
 * @openapi
 * /api/task/{id}:
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
router.get('/task/{id}', async (req: Request, res: Response) => {
  try {
    const { taskId } = await taskSchema.getTaskSchema.parseAsync(req.query);
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });
    if (!task) {
      return res.status(404).json({ message: 'Task not found', isSuccess: false });
    }
    res.status(200).json(task);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ message: err.issues, isSuccess: false });
    }
    console.error(err);
    res.status(500).json({ message: 'There was an issue with the database connection', isSuccess: false });
  }
});


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
router.post('/tasks', async (req: Request, res: Response) => {
  try {
      const { title, createdBy } = await taskSchema.createTaskSchema.parseAsync(req.body);
      const task = await prisma.task.create({
      data: {
          title,
          createdBy
      }
      })
      res.status(200).json({message: "Task created successfully", isSuccess: true, task})
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ message: err.issues, isSuccess: false });
    }
    console.error(err);
    res.status(500).json({ message: 'There was an issue with the database connection', isSuccess: false });
  }
})


/**
 * @openapi
 * /api/task/{id}:
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
router.put('/task/{id}', async (req: Request, res: Response) => {
  try {
    const {id, newTitle, description, dueDate, assignedTo, status} = await taskSchema.updateTaskSchema.parseAsync(req.body);
      const task = await prisma.task.update({
          where: {id},
          data: {
              title: newTitle,
              description,
              deadline: dueDate,
              assignedTo,
              status: STATUS[status]
          }
      })
      
      res.status(200).json({message: "Task updated successfully", isSuccess: true, task})
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ message: err.issues, isSuccess: false });
    }
    console.error(err);
    res.status(500).json({ message: 'There was an issue with the database connection', isSuccess: false });
  }
})

/**
 * @openapi
 * /api/tasks/{taskId}/assign:
 *  post:
 *      tags:
 *        - Tasks
 *      summary: Assign a task
 *      description: Assign a task to a user with the provided task ID and user ID
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
router.post('/tasks/{taskId}/assign', async (req: Request, res: Response) => {
  try {
    const { taskId, assignedTo } = await taskSchema.assignTaskSchema.parseAsync(req.body);
    const task = await prisma.task.update({
      where: { id: taskId },
      data: {
        assignedTo,
      },
    });
    res.status(200).json({ message: 'Task assigned successfully', isSuccess: true, task });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ message: err.issues, isSuccess: false });
    }
    console.error(err);
    res.status(500).json({ message: 'There was an issue with the database connection', isSuccess: false });
  }
});

/**
 * @openapi
 * /api/task/{id}:
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
router.delete('/task/{id}', async (req: Request, res: Response) => {
  try {
    const { taskId } = await taskSchema.deleteTaskSchema.parseAsync(req.query);
    const task = await prisma.task.findUnique({
      where: { id: taskId },
    });
    if (!task) {
      return res.status(404).json({ message: 'Task not found', isSuccess: false });
    }
    await prisma.task.delete({
      where: { id: taskId },
    });
    res.status(200).json({ message: 'Task deleted successfully', isSuccess: true });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ message: err.issues, isSuccess: false });
    }
    res.status(500).json({ message: 'There was an issue with the database connection', isSuccess: false });
  }
});


/**
 * @openapi
 * /api/task/{taskId}/assign/{userId}:
 *  delete:
 *      tags:
 *        - Tasks
 *      summary: Unassign a task
 *      description: Unassign a task from a user with the provided task ID and user ID
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
router.delete('/task/{taskId}/assign/{userId}', async (req: Request, res: Response) => {
  try {
    const { taskId, userId } = req.params;
    const task = await prisma.task.findUnique({
      where: { id: parseInt(taskId) },
    });
    if (!task) {
      return res.status(404).json({ message: 'Task not found', isSuccess: false });
    }
    await prisma.task.update({
      where: { id: parseInt(taskId) },
      data: {
        assignedTo: null,
      },
    });
    res.status(200).json({ message: 'Task unassigned successfully', isSuccess: true });
    
  } catch (error) {
    
  }
})

export default router;