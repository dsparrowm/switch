import { describe, beforeEach, test, expect, vi } from 'vitest';
import { Request, Response } from 'express';
import postPrivateMessage from '../../../src/handlers/messages/postPrivateMessage';
import prisma from '../../../src/__mocks__/db';

vi.mock('../../../src/db');


const mockRequest = {
  body: {
    senderId: 1,
    recipientId: 2,
    content: "hello"
  }
} as unknown as Request

const mockResponse = {
  status: vi.fn().mockReturnThis(),
  json: vi.fn()
} as unknown as Response

describe('Send Private Message', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    test('Send a private chat', async () => {
        const date = new Date()
        prisma.message.create.mockResolvedValue({
            id: 1,
            senderId: 1,
            recipientId: 2,
            content: "hello",
            createdAt: date,
            updatedAt: date,
            departmentId: null
        })

        await postPrivateMessage(mockRequest, mockResponse)
        expect(prisma.message.create).toHaveBeenCalledWith({
            data: {
                senderId: 1,
                recipientId: 2,
                content: "hello"
            }
        })
        expect(mockResponse.status).toHaveBeenCalledWith(200)
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: {
                id: 1,
                senderId: 1,
                recipientId: 2,
                content: "hello",
                createdAt: date,
                updatedAt: date,
                departmentId: null
            },
            isSuccess: true
        })
    })

    test('It should return a Zod validation error if the request body is invalid', async () => {
        const invalidRequest = {
         body: {
           //missing senderId
           recipientId: 2,
           content: "hello"
         }
        } as unknown as Request;
    
        await postPrivateMessage(invalidRequest, mockResponse);
    
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: expect.any(Array),
          isSuccess: false
        });
    });
    
    test('it should return a 500 error if an error occurs', async () => {
        prisma.message.create.mockRejectedValue(new Error('Test Error'));

        await postPrivateMessage(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: "Test Error",
            isSuccess: false
        });
    });
})