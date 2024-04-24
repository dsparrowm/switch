import { describe, beforeEach, test, expect, vi } from 'vitest';
import { Request, Response } from 'express';
import updateTask from '../../../src/handlers/tasks/updateTask';
import prisma from '../../../src/__mocks__/db';
import { $Enums } from '@prisma/client';

vi.mock('../../../src/db');

const date = new Date()
const mockRequest = {
  body: {
    id: 1,
    newTitle: "Task",
    description: "new task",
    deadline: date,
    assignedTo: 1,
    status: 'COMPLETED'
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

    test('It should update the task with the new details', async () => {
        prisma.task.findUnique.mockResolvedValue({
            id: 1,
            title: "Task",
            description: null,
            createdAt: date,
            updatedAt: date,
            deadline: null,
            createdBy: 1,
            assignedTo: null,
            status: $Enums.STATUS['COMPLETED']
        })
        prisma.task.update.mockResolvedValue({
            id: 1,
            title: "Task",
            description: null,
            createdAt: date,
            updatedAt: date,
            deadline: null,
            createdBy: 1,
            assignedTo: null,
            status: $Enums.STATUS['COMPLETED']
        })

        await updateTask(mockRequest, mockResponse)
        expect(prisma.task.findUnique).toHaveBeenCalledWith({
            where: {id: 1}
        })
        expect(prisma.task.update).toHaveBeenCalledWith({
            where: {id: 1},
            data: {
                title: "Task",
                description: "new task",
                deadline: date,
                assignedTo: 1,
                status: $Enums.STATUS['COMPLETED']
            }
        })
        expect(mockResponse.status).toHaveBeenCalledWith(200)
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: "Task updated successfully",
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
                status: $Enums.STATUS['COMPLETED']
            }
        })
    })

    test('It should return a Zod validation error if the request body is invalid', async () => {
        const invalidRequest = {
         body: {
            //missing body
            
         }
        } as unknown as Request;
    
        await updateTask(invalidRequest, mockResponse);
    
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: expect.any(Array),
          isSuccess: false
        });
    });

    test('it should return a 500 error if an error occurs', async () => {
        prisma.task.findUnique.mockRejectedValue(new Error('Test Error'));
    
        await updateTask(mockRequest, mockResponse);
    
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: "Test Error",
          isSuccess: false
        });
    });

    test('it should return a 404 error when the user does not exist', async () => {
        prisma.task.findUnique.mockResolvedValue(null);
    
        await updateTask(mockRequest, mockResponse);
    
        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: 'No task found', isSuccess: false
        });
      });
})