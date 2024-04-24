import { describe, beforeEach, test, expect, vi } from 'vitest';
import { Request, Response, query } from 'express';
import getPrivateMessage from '../../../src/handlers/messages/getPrivateMessage';
import prisma from '../../../src/__mocks__/db';

vi.mock('../../../src/db');


const mockRequest = {
  query: {
    receiverId: 1,
    senderId: 2
  }
} as unknown as Request

const mockResponse = {
  status: vi.fn(),
  json: vi.fn()
} as unknown as Response

describe('Get Private Message', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    test('It should Get Private chats between two users', async () => {
        const date = new Date()
        prisma.message.findMany.mockResolvedValue([
            {
                id: 1,
                senderId: 1,
                recipientId: 2,
                content: "hello",
                createdAt: date,
                updatedAt: date,
                departmentId: null
            },
            {
                id: 2,
                senderId: 2,
                recipientId: 1,
                content: "hello",
                createdAt: date,
                updatedAt: date,
                departmentId: null
            }
        ])
        await getPrivateMessage(mockRequest, mockResponse)
        expect(prisma.message.findMany).toHaveBeenCalledWith({
            where: {
                OR: [
                {
                    AND: [
                    { senderId: 2 },
                    { recipientId: 1 }
                    ]
                },
                {
                    AND: [
                    { senderId: 1 },
                    { recipientId: 2 }
                    ]
                }
                ]
            },
            include: {sender: true},
            orderBy: {
                createdAt: 'asc'
            }
        })
        expect(mockResponse.status).toHaveBeenCalledWith(200)
        expect(mockResponse.json).toHaveBeenCalledWith({
            messages: [
                {
                    id: 1,
                    senderId: 1,
                    recipientId: 2,
                    content: "hello",
                    createdAt: date,
                    updatedAt: date,
                    departmentId: null
                },
                {
                    id: 2,
                    senderId: 2,
                    recipientId: 1,
                    content: "hello",
                    createdAt: date,
                    updatedAt: date,
                    departmentId: null
                }
            ],
            isSuccess: true
        })
    })

    test('It should return a Zod validation error if the request body is invalid', async () => {
        const invalidRequest = {
         body: {
           //Body request instead of query string
           recipientId: 1,
           senderId: 2
         }
        } as unknown as Request;
    
        await getPrivateMessage(invalidRequest, mockResponse);
    
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: expect.any(Array),
          isSuccess: false
        });
    });

    test('it should return a 500 error if an error occurs', async () => {
        prisma.message.findMany.mockRejectedValue(new Error('Test Error'));

        await getPrivateMessage(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: "Test Error",
            isSuccess: false
        });
    });
})