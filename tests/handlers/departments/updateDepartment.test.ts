import { describe, beforeEach, test, expect, vi } from 'vitest';
import { Request, Response } from 'express';
import updateDepartment from '../../../src/handlers/departments/updateDepartment';
import prisma from '../../../src/__mocks__/db';

vi.mock('../../../src/db');

const mockRequest = {
    body: {
      departmentId: 1,
      departmentName: "department",
      organisationId: 1
    }
  } as unknown as Request;
  
  const mockResponse = {
    status: vi.fn(),
    json: vi.fn()
  } as unknown as Response;

describe('Update Department', () => {
    beforeEach(() => {
        vi.resetAllMocks();
      });

    test('It should update a department withing an organisation', async () => {
        const date = new Date()
        prisma.department.findUnique.mockResolvedValue({
            id: 1,
            name: "Test deparment",
            organisationId: 1,
            createdAt: date,
            updatedAt: date
        })

        prisma.department.update.mockResolvedValue({
            id: 1,
            name: "Test deparment",
            organisationId: 1,
            createdAt: date,
            updatedAt: date 
        })

        await updateDepartment(mockRequest, mockResponse)

        expect(prisma.department.findUnique).toHaveBeenCalledWith({
            where: {
                id: 1,
                AND: [
                  { organisationId: 1 }
                ]
              }
        })

        expect(prisma.department.update).toHaveBeenCalledWith(
            {
                where: {
                   id: 1,
                   AND: [
                    { organisationId: 1 }
                  ]
                  },
                data: { name: "department" },
              }
        )
        expect(mockResponse.status).toHaveBeenCalledWith(200)
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: 'Department updated successfully', isSuccess: true
        })
    })

    test('it should return a 404 error when the user does not exist', async () => {
        prisma.department.findUnique.mockResolvedValue(null);
    
        await updateDepartment(mockRequest, mockResponse);
    
        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: "No department found", isSuccess: false
        });
    });

    test('It should return a Zod validation error if the request body is invalid', async () => {
        const invalidRequest = {
         body: {
           //missing organisationId
           departmentId: 1,
           departmentName: "department",
         }
        } as unknown as Request;
    
        await updateDepartment(invalidRequest, mockResponse);
    
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: expect.any(Array),
          isSuccess: false
        });
    });

    test('it should return a 500 error if an unexpected error occurs', async () => {
        prisma.department.findUnique.mockRejectedValue(new Error('Test Error'));
    
        await updateDepartment(mockRequest, mockResponse);
    
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: "There was an internal server error",
          isSuccess: false
        });
      });
})

