import { describe, beforeEach, test, expect, vi } from 'vitest';
import { Request, Response } from 'express';
import assignTask from '../../../src/handlers/tasks/assignTask';
import prisma from '../../../src/__mocks__/db';

vi.mock('../../../src/db');

const mockRequest = {
  body: {
    taskId: 1,
    assignedTo: 1
  }
} as unknown as Request;

const mockResponse = {
  status: vi.fn(),
  json: vi.fn()
} as unknown as Response;

describe('Assign Task', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    test('It should assign task to a user', async () => {
        const date = new Date()
        prisma.task.update.mockResolvedValue({
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

        await assignTask(mockRequest, mockResponse)

        expect(prisma.task.update).toHaveBeenCalledWith({
            where: { id: 1 },
            data: {
              assignedTo: 1,
            },
        })
        expect(mockResponse.status).toHaveBeenCalledWith(200)
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: 'Task assigned successfully',
            isSuccess: true,
        })
    })

    test('It should return a Zod validation error if the request body is invalid', async () => {
        const invalidRequest = {
         body: {
            //missing taskId
            assignedTo: 1
         }
        } as unknown as Request;
    
        await assignTask(invalidRequest, mockResponse);
    
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: expect.any(Array),
          isSuccess: false
        });
    });

    test('it should return a 500 error if an error occurs', async () => {
        prisma.task.update.mockRejectedValue(new Error('Test Error'));
    
        await assignTask(mockRequest, mockResponse);
    
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: "Test Error",
          isSuccess: false
        });
    });
})