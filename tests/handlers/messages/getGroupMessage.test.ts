import { describe, beforeEach, test, expect, vi } from 'vitest';
import { Request, Response, query } from 'express';
import getGroupMessage from '../../../src/handlers/messages/getGroupMessage';
import prisma from '../../../src/__mocks__/db';

vi.mock('../../../src/db');


const mockRequest = {
  query: {
    departmentId: 1
  }
} as unknown as Request

const mockResponse = {
  status: vi.fn().mockReturnThis(),
  json: vi.fn()
} as unknown as Response

describe('Get Group Message', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    test('Get all messages in a department', async () => {
        const date = new Date()
        prisma.message.findMany.mockResolvedValue([
            {
                id: 1,
                senderId: 1,
                recipientId: null,
                content: "hello",
                createdAt: date,
                updatedAt: date,
                departmentId: 1
            },
            {
                id: 2,
                senderId: 1,
                recipientId: null,
                content: "hello",
                createdAt: date,
                updatedAt: date,
                departmentId: 1
            }
        ])

        await getGroupMessage(mockRequest, mockResponse)

        expect(prisma.message.findMany).toHaveBeenCalledWith({
            where: {
                departmentId: 1,
              },
              include: {sender: true},
              orderBy: {createdAt: 'asc'}
        })
        expect(mockResponse.status).toHaveBeenCalledWith(200)
        expect(mockResponse.json).toHaveBeenCalledWith({
            isSuccess: true,
            messages: [
                {
                    id: 1,
                    senderId: 1,
                    recipientId: null,
                    content: "hello",
                    createdAt: date,
                    updatedAt: date,
                    departmentId: 1  
                },
                {
                    id: 2,
                    senderId: 1,
                    recipientId: null,
                    content: "hello",
                    createdAt: date,
                    updatedAt: date,
                    departmentId: 1
                }
            ]
        })
    })

    test('It should return a Zod validation error if the request body is invalid', async () => {
        const invalidRequest = {
         body: {
           //Body request instead of query string
           departmentId: 1
         }
        } as unknown as Request;
    
        await getGroupMessage(invalidRequest, mockResponse);
    
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: expect.any(Array),
          isSuccess: false
        });
    });
    
    test('it should return a 500 error if an error occurs', async () => {
        prisma.message.findMany.mockRejectedValue(new Error('Test Error'));

        await getGroupMessage(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: "Test Error",
            isSuccess: false
        });
    });

    test('it should return a 404 when no messages are found', async () => {
        const mockRequestData = {
            query: {
              departmentId: 7
            }
          } as unknown as Request

        prisma.message.findMany.mockResolvedValue([]);
    
        await getGroupMessage(mockRequestData, mockResponse);
    
        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: "No messages found", isSuccess: false
        });
      });
})