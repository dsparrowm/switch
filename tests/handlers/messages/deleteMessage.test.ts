import { describe, beforeEach, test, expect, vi } from 'vitest';
import { Request, Response } from 'express';
import deleteMessage from '../../../src/handlers/messages/deleteMessage';
import prisma from '../../../src/__mocks__/db';

vi.mock('../../../src/db');


const mockRequest = {
  query: {
    messageId: 1
  }
} as unknown as Request

const mockResponse = {
  status: vi.fn(),
  json: vi.fn()
} as unknown as Response

describe('Delete Message', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    test("It should delete a message", async () => {
        const date = new Date()
        prisma.message.delete.mockResolvedValue({
            id: 1,
            senderId: 1,
            recipientId: 2,
            content: "hello",
            createdAt: date,
            updatedAt: date,
            departmentId: null
        })

        await deleteMessage(mockRequest, mockResponse)
        expect(prisma.message.delete).toHaveBeenCalledWith({
            where: {id: 1}
        })
        expect(mockResponse.status).toHaveBeenCalledWith(200)
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: "message deleted successfully", isSuccess: true
        })
    })

    test('It should return a Zod validation error if the request body is invalid', async () => {
        const invalidRequest = {
         query: {
           //missing message Id
           messageId: "helle"
         }
        } as unknown as Request;
    
        await deleteMessage(invalidRequest, mockResponse);
    
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: expect.any(Array),
          isSuccess: false
        });
    });

    test('it should return a 500 error if an error occurs', async () => {
        prisma.message.delete.mockRejectedValue(new Error('Test Error'));

        await deleteMessage(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: "Test Error",
            isSuccess: false
        });
    });
})