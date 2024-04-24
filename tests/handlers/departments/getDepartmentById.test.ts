import { describe, beforeEach, test, expect, vi } from 'vitest';
import { Request, Response } from 'express';
import getDepartmentById from '../../../src/handlers/departments/getDepartmentById';
import prisma from '../../../src/__mocks__/db';
import { date } from 'zod';

vi.mock('../../../src/db');

const mockRequest = {
  query: {
    departmentId: 1,
    organisationId: 1
  }
} as unknown as Request;

const mockResponse = {
  status: vi.fn(),
  json: vi.fn()
} as unknown as Response;

describe('Get Department', () => {
    beforeEach(() => {
        vi.resetAllMocks();
      });

    test("Get a department detail from an organisation using it's Id", async () => {
        const date = new Date()
        prisma.department.findUnique.mockResolvedValue({
            id: 1,
            name: "department",
            organisationId: 1,
            createdAt: date,
            updatedAt: date
        })

        await getDepartmentById(mockRequest, mockResponse)

        expect(prisma.department.findUnique).toHaveBeenCalledWith({
            where: {
                id: 1,
                AND: [
                  { organisationId: 1}
                ]
              },
        })

        expect(mockResponse.status).toHaveBeenCalledWith(200)
        expect(mockResponse.json).toHaveBeenCalledWith({
            department: {
                id: 1,
                name: "department",
                organisationId: 1,
                createdAt: date,
                updatedAt: date
            },
            isSuccess: true
        })
    })

    test('it should return a 404 error when the user does not exist', async () => {
        prisma.department.findUnique.mockResolvedValue(null);
    
        await getDepartmentById(mockRequest, mockResponse);
    
        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: 'No department found', isSuccess: false
        });
    });

    test('It should return a Zod validation error if the request body is invalid', async () => {
        const invalidRequest = {
         body: {
           //missing organisationId
           departmentId: 1,
         }
        } as unknown as Request;
    
        await getDepartmentById(invalidRequest, mockResponse);
    
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: expect.any(Array),
          isSuccess: false
        });
    });

    test('it should return a 500 error if an error occurs', async () => {
        prisma.department.findUnique.mockRejectedValue(new Error('Test Error'));
    
        await getDepartmentById(mockRequest, mockResponse);
    
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: "Test Error",
          isSuccess: false
        });
    });
})