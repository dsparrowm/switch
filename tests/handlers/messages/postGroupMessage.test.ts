import { describe, beforeEach, test, expect, vi } from 'vitest';
import { Request, Response } from 'express';
import postGroupMessage from '../../../src/handlers/messages/postGroupMessage';
import prisma from '../../../src/__mocks__/db';

vi.mock('../../../src/db');


const mockRequest = {
  body: {
    senderId: 1,
    departmentId: 1,
    content: "hello"
  }
} as unknown as Request

const mockResponse = {
  status: vi.fn(),
  json: vi.fn()
} as unknown as Response

describe('Send Group Message', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    test('It should send a group message', async () => {
        const date = new Date()
        prisma.user.findUnique.mockResolvedValue({
            id: 1,
            name: "test user",
            email: "test@gmail.com",
            password: "password",
            createdAt: date,
            updatedAt: date
        })
        prisma.department.findUnique.mockResolvedValue({
            id: 1,
            name: "General",
            organisationId: 1,
            createdAt: date,
            updatedAt: date
        })
        prisma.message.create.mockResolvedValue({
            id: 1,
            senderId: 1,
            recipientId: null,
            content: "hello",
            createdAt: date,
            updatedAt: date,
            departmentId: 1
        })
        prisma.message.findUnique.mockResolvedValue({
            id: 1,
            senderId: 1,
            recipientId: null,
            content: "hello",
            createdAt: date,
            updatedAt: date,
            departmentId: 1
        })

        await postGroupMessage(mockRequest, mockResponse)

        expect(prisma.user.findUnique).toHaveBeenCalledWith({
            where: {id: 1}
        })
        expect(prisma.department.findUnique).toHaveBeenCalledWith({
            where: {id: 1}
        })
        expect(prisma.message.create).toHaveBeenCalledWith({
            data: {
                senderId: 1,
                content: "hello",
                departmentId: 1
            }
        })
        expect(prisma.message.findUnique).toHaveBeenCalledWith({
            where: {
                id: 1
            },
            include: {sender: true}
        })
        expect(mockResponse.status).toHaveBeenCalledWith(200)
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: "message sent successfully",
            isSuccess: true,
            messages: {
                id: 1,
                senderId: 1,
                recipientId: null,
                content: "hello",
                createdAt: date,
                updatedAt: date,
                departmentId: 1
            }
        })

    })

    test('It should return a Zod validation error if the request body is invalid', async () => {
        const invalidRequest = {
         body: {
           //missing senderId
           departmentId: 2,
           content: "hello"
         }
        } as unknown as Request;
    
        await postGroupMessage(invalidRequest, mockResponse);
    
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: expect.any(Array),
          isSuccess: false
        });
    });

    test('it should return a 500 error if an error occurs', async () => {
        prisma.user.findUnique.mockRejectedValue(new Error('Test Error'));

        await postGroupMessage(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: "Test Error",
            isSuccess: false
        });
    });

    test('it should return a 404 error when the user does not exist', async () => {
        prisma.user.findUnique.mockResolvedValue(null);
    
        await postGroupMessage(mockRequest, mockResponse);
    
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: "Id of this sender does not exist", isSuccess: false
        });
    });
})