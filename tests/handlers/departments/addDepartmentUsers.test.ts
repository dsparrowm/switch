import { describe, beforeEach, test, expect, vi } from 'vitest';
import { Request, Response } from 'express';
import addDepartmentUsers from '../../../src/handlers/departments/addDepartmentUsers';
import prisma from '../../../src/__mocks__/db';

vi.mock('../../../src/db');

const mockRequest = {
    body: {
      userIds: [2],
      adminOrDeptHeadId: 1,
      departmentId: 1
    }
  } as unknown as Request;
  
  const mockResponse = {
    status: vi.fn(),
    json: vi.fn()
  } as unknown as Response;

describe('Add Departments Users', () => {
    beforeEach(() => {
        vi.resetAllMocks();
      });

    test('Add users to department', async () => {
        const date = new Date()
        prisma.user.findUnique.mockResolvedValue({
            id: 1,
            name: "Test user",
            email: "testuser@gmail.com",
            password: "password",
            createdAt: date,
            updatedAt: date
        })

        prisma.department.update.mockResolvedValue({
            id: 1,
            name: "test department",
            organisationId: 1,
            createdAt: date,
            updatedAt: date
        })

        await addDepartmentUsers(mockRequest, mockResponse)

        expect(prisma.user.findUnique).toHaveBeenCalledWith({
            where: {id: 1},
            include: {
                roles: true,
            },
        })

        expect(prisma.department.update).toHaveBeenCalledWith({
            where: { id: 1 },
            data: {
                users: {
                  create: [{userId: 2}]
                },
              },
        })

        expect(mockResponse.status).toHaveBeenCalledWith(200)
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: 'User(s) added successfully to department', isSuccess: true
        })
    })

    test('It should return a Zod validation error if the request body is invalid', async () => {
      const invalidRequest = {
       body: {
         //missing userIds and adminOrDeptHeadId
         departmentId: 1
       }
      } as unknown as Request;
  
      await addDepartmentUsers(invalidRequest, mockResponse);
  
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: expect.any(Array),
        isSuccess: false
      });
    });

    test('it should return a 500 error if an error occurs', async () => {
      prisma.user.findUnique.mockRejectedValue(new Error('Test Error'));
  
      await addDepartmentUsers(mockRequest, mockResponse);
  
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: "Test Error",
        isSuccess: false
      });
    });
})