import { describe, beforeEach, test, expect, vi } from 'vitest';
import { Request, Response } from 'express';
import deleteTask from '../../../src/handlers/tasks/deleteTask';
import prisma from '../../../src/__mocks__/db';
import { date } from 'zod';

vi.mock('../../../src/db');

const mockRequest = {
  query: {
    taskId: 1
  }
} as unknown as Request;

const mockResponse = {
  status: vi.fn(),
  json: vi.fn()
} as unknown as Response;

describe('Delete Task', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    test('It should delete a task', async () => {
        const date = new Date()
        prisma.task.findUnique.mockResolvedValue({
            id: 1,
            title: "Task",
            description: null,
            createdAt: date,
            updatedAt: date,
            deadline: null,
            createdBy: 1,
            assignedTo: null,
            status: 'TODO'
        })

        prisma.task.delete.mockResolvedValue({
            id: 1,
            title: "Task",
            description: null,
            createdAt: date,
            updatedAt: date,
            deadline: null,
            createdBy: 1,
            assignedTo: null,
            status: 'TODO'
        })

        await deleteTask(mockRequest, mockResponse)
        expect(prisma.task.findUnique).toHaveBeenCalledWith({
            where: { id: 1 }
        })
        expect(prisma.task.delete).toHaveBeenCalledWith({
            where: { id: 1 }
        })
        expect(mockResponse.status).toHaveBeenCalledWith(200)
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: 'Task deleted successfully', isSuccess: true
        })
    })

    test('It should return a Zod validation error if the request body is invalid', async () => {
        const invalidRequest = {
         body: {
            //request body instead of query string
            taskId: 1
         }
        } as unknown as Request;
    
        await deleteTask(invalidRequest, mockResponse);
    
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: expect.any(Array),
          isSuccess: false
        });
    });

    test('it should return a 500 error if an error occurs', async () => {
        prisma.task.findUnique.mockRejectedValue(new Error('Test Error'));
    
        await deleteTask(mockRequest, mockResponse);
    
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: "Test Error",
          isSuccess: false
        });
    });

})