import { describe, beforeEach, test, expect, vi } from 'vitest';
import { Request, Response } from 'express';
import createTask from '../../../src/handlers/tasks/createTask';
import prisma from '../../../src/__mocks__/db';
import { date } from 'zod';

vi.mock('../../../src/db');

const mockRequest = {
  body: {
    title: "Task",
    createdBy: 1,

  }
} as unknown as Request;

const mockResponse = {
  status: vi.fn(),
  json: vi.fn()
} as unknown as Response;

describe('Create Task', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    test('It should create a task', async () => {
        const date = new Date()
        prisma.task.create.mockResolvedValue({
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

        await createTask(mockRequest, mockResponse)
        
        expect(prisma.task.create).toHaveBeenCalledWith({
          data: {
            title: "Task",
            createdBy: 1
          }
        })

        expect(mockResponse.status).toHaveBeenCalledWith(200)
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: "Task created successfully",
          isSuccess: true,
          task: {
            id: 1,
            title: "Task",
            description: null,
            createdAt: date,
            updatedAt: date,
            deadline: null,
            createdBy: 1,
            assignedTo: null,
            status: 'TODO'
          } 
        })
    })

    test('It should return a Zod validation error if the request body is invalid', async () => {
      const invalidRequest = {
       body: {
         //missing title
         createdBy: 1
       }
      } as unknown as Request;
  
      await createTask(invalidRequest, mockResponse);
  
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: expect.any(Array),
        isSuccess: false
      });
    });

    test('it should return a 500 error if an error occurs', async () => {
      prisma.task.create.mockRejectedValue(new Error('Test Error'));
  
      await createTask(mockRequest, mockResponse);
  
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Test Error",
        isSuccess: false
      });
    });
})