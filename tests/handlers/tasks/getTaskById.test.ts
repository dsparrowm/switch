import { describe, beforeEach, test, expect, vi } from 'vitest';
import { Request, Response } from 'express';
import getTaskById from '../../../src/handlers/tasks/getTaskById';
import prisma from '../../../src/__mocks__/db';

vi.mock('../../../src/db');

const mockRequest = {
  query: {
    taskId: 1,
  }
} as unknown as Request;

const mockResponse = {
  status: vi.fn(),
  json: vi.fn()
} as unknown as Response;

describe('Get Task', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    test('It should get a task using the Id', async () => {
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

        await getTaskById(mockRequest, mockResponse)

        expect(prisma.task.findUnique).toHaveBeenCalledWith({
            where: {id: 1}
        })
        expect(mockResponse.status).toHaveBeenCalledWith(200)
        expect(mockResponse.json).toHaveBeenCalledWith({
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
    })

    test('It should return a Zod validation error if the request body is invalid', async () => {
        const invalidRequest = {
         query: {
           //taskId is not a number
           taskId: "12e"
         }
        } as unknown as Request;
    
        await getTaskById(invalidRequest, mockResponse);
    
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: expect.any(Array),
          isSuccess: false
        });
    });

    test('it should return a 404 error when the user does not exist', async () => {
        prisma.task.findUnique.mockResolvedValue(null);
    
        await getTaskById(mockRequest, mockResponse);
    
        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: 'Task not found', isSuccess: false,
        });
    });

    test('it should return a 500 error if an error occurs', async () => {
        prisma.task.findUnique.mockRejectedValue(new Error('Test Error'));
    
        await getTaskById(mockRequest, mockResponse);
    
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: "Test Error",
          isSuccess: false
        });
    });
})