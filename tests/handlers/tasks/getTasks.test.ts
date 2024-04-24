import { describe, beforeEach, test, expect, vi } from 'vitest';
import { Request, Response } from 'express';
import getTasks from '../../../src/handlers/tasks/getTasks';
import prisma from '../../../src/__mocks__/db';

vi.mock('../../../src/db');

const mockRequest = {
  query: {
    userId: 1
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

    test('It should get all tasks of a particular user', async () => {
        const date = new Date()
        prisma.task.findMany.mockResolvedValue([
            {
                id: 1,
                title: "Task",
                description: null,
                createdAt: date,
                updatedAt: date,
                deadline: null,
                createdBy: 1,
                assignedTo: null,
                status: 'TODO'
            },
            {
                id: 2,
                title: "Task",
                description: null,
                createdAt: date,
                updatedAt: date,
                deadline: null,
                createdBy: 2,
                assignedTo: 1,
                status: 'TODO'
            }
        ])
        
        await getTasks(mockRequest, mockResponse)
        expect(prisma.task.findMany).toHaveBeenCalledWith({
            where: {
                OR: [
                  { createdBy: 1 },
                  { assignedTo: 1 }
                ]
              }
        })
        expect(mockResponse.status).toHaveBeenCalledWith(200)
        expect(mockResponse.json).toHaveBeenCalledWith([
            {
                id: 1,
                title: "Task",
                description: null,
                createdAt: date,
                updatedAt: date,
                deadline: null,
                createdBy: 1,
                assignedTo: null,
                status: 'TODO'
            },
            {
                id: 2,
                title: "Task",
                description: null,
                createdAt: date,
                updatedAt: date,
                deadline: null,
                createdBy: 2,
                assignedTo: 1,
                status: 'TODO'
            }
        ])
    })

    test('It should return a Zod validation error if the request body is invalid', async () => {
        const invalidRequest = {
         query: {
            //missing taskId
         }
        } as unknown as Request;
    
        await getTasks(invalidRequest, mockResponse);
    
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: expect.any(Array),
          isSuccess: false
        });
    });

    test('it should return a 500 error if an error occurs', async () => {
        prisma.task.findMany.mockRejectedValue(new Error('Test Error'));
    
        await getTasks(mockRequest, mockResponse);
    
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: "Test Error",
          isSuccess: false
        });
    });

    test('it should return a 404 error when the user does not exist', async () => {
        prisma.task.findMany.mockResolvedValue([]);
    
        await getTasks(mockRequest, mockResponse);
    
        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: 'No tasks found', isSuccess: false
        });
    });
})