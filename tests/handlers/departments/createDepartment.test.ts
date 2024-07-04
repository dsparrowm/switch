import { describe, beforeEach, test, expect, vi } from 'vitest';
import { Request, Response } from 'express';
import createDepartment from '../../../src/handlers/departments/createDepartment';
import prisma from '../../../src/__mocks__/db'

vi.mock('../../../src/db');

const mockRequest = {
    body: {
      userId: 1,
      departmentName: "Test department",
      organisationId: 1
    }
  } as unknown as Request;
  
const mockResponse = {
    status: vi.fn(),
    json: vi.fn()
} as unknown as Response;

describe('create Department', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });
    
    test('It should create a new department withing an organisation', async () => {
        const date = new Date()
        prisma.user.findUnique.mockResolvedValue({
            id: 1,
            name: "test user",
            email: "testuser@gmail.com",
            password: "password",
            createdAt: date,
            updatedAt: date,
        })
        prisma.department.create.mockResolvedValue({
            id: 1,
            name: "Test department",
            createdAt: date,
            updatedAt: date,
            organisationId: 1
        })
        prisma.userRole.findMany.mockResolvedValue([
            {
                id: 1,
                userId: 1,
                updatedAt: date,
                roleId: 1,
                organisationId: 1,
                createdAt: date,
            },
            {
                id: 2,
                userId: 2,
                updatedAt: date,
                roleId: 1,
                organisationId: 1,
                createdAt: date,
            },

        ])
        prisma.userDepartment.create.mockResolvedValue({
            id: 1,
            departmentId: 1,
            userId: 1,
            createdAt: date,
            updatedAt: date
        })

        await createDepartment(mockRequest, mockResponse)

        expect(prisma.user.findUnique).toHaveBeenCalledWith({
            where: { id: 1 }
        })
        expect(prisma.department.create).toHaveBeenCalledWith({
            data: {
                name: "Test department",
                organisationId: 1,
              },
        })
        expect(prisma.userRole.findMany).toHaveBeenCalledWith({
            where: { 
                AND: [
                    { role: { name: 'admin' } },
                    {organisationId: 1}
                ]
             },
            include: { role: true },
        })
        expect(prisma.userDepartment.create).toHaveBeenCalledWith({
            data: {
                userId: 1,
                departmentId: 1,
              },
        })
        expect(prisma.userDepartment.create).toHaveBeenCalledTimes(2)
        expect(mockResponse.status).toHaveBeenCalledWith(200)
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: 'Department created successfully', isSuccess: true
        })
    })

    test('it should return a 404 error when the user does not exist', async () => {
        const mockRequest = {
            body: {
              userId: 400,
              departmentName: "Test department",
              organisationId: 1
            }
        } as unknown as Request;
        prisma.user.findUnique.mockResolvedValue(null);
    
        await createDepartment(mockRequest, mockResponse);
    
        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: 'User does not exist', isSuccess: false
        });
    });

    test('It should return a Zod validation error if the request body is invalid', async () => {
        const invalidRequest = {
         body: {
           //missing userId
           departmentName: "Test department",
           organisationId: 1
         }
        } as unknown as Request;
    
        await createDepartment(invalidRequest, mockResponse);
    
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: expect.any(Array),
          isSuccess: false
        });
    });

    test('it should return a 500 error if an error occurs', async () => {
        prisma.user.findUnique.mockRejectedValue(new Error('There was an internal server error'));
    
        await createDepartment(mockRequest, mockResponse);
    
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: "There was an internal server error",
          isSuccess: false
        });
    });
})