import { describe, beforeEach, test, expect, vi } from 'vitest';
import { Request, Response } from 'express';
import deleteDepartment from '../../../src/handlers/departments/deleteDepartment';
import prisma from '../../../src/__mocks__/db';

vi.mock('../../../src/db');

const mockRequest = {
    body: {
      departmentId: 1,
      organisationId: 1
    }
  } as unknown as Request;
  
  const mockResponse = {
    status: vi.fn(),
    json: vi.fn()
  } as unknown as Response;

describe('Delete Department', () => {
    beforeEach(() => {
        vi.resetAllMocks();
      });
    
    test('Delete a department from an organisation', async () => {
        const date = new Date()
        prisma.department.findUnique.mockResolvedValue({
            id: 1,
            name: "Test department",
            organisationId: 1,
            createdAt: date,
            updatedAt: date
        })
        prisma.department.delete.mockResolvedValue({
            id: 1,
            name: "Test department",
            organisationId: 1,
            createdAt: date,
            updatedAt: date
        })

        await deleteDepartment(mockRequest, mockResponse)

        expect(prisma.department.findUnique).toHaveBeenCalledWith({
            where: {
                id: 1,
                AND: [
                    {organisationId: 1}
                ]
            }
        })
        expect(prisma.department.delete).toHaveBeenCalledWith({
            where: { 
                id: 1,
                AND: [
                  { organisationId: 1 }
                ]
               },
        })
        expect(mockResponse.status).toHaveBeenCalledWith(200)
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: 'Department deleted successfully', isSuccess: true
        })
    })

    test('It should throw a 404 error if no department is found', async () => {
        prisma.department.findUnique.mockResolvedValue(null)

        await deleteDepartment(mockRequest, mockResponse)

        expect(mockResponse.status).toHaveBeenCalledWith(404)
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: "No department found", isSuccess: false
        })
    })

    test('It should throw a zod validation error if an invalid request is made', async () => {
        const invalidRequest = {
            body: {
              //missing organisationId
              departmentId: 1
            }
           } as unknown as Request;

        await deleteDepartment(invalidRequest, mockResponse)

        expect(mockResponse.status).toHaveBeenCalledWith(400)
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: expect.any(Array),
            isSuccess: false
        })
    })

    test('it should throw a 500 internal server error if an unexpected error occurs', async () => {
        const err = new Error('Test Error')
        prisma.department.findUnique.mockRejectedValue(err)

        await deleteDepartment(mockRequest, mockResponse)

        expect(mockResponse.status).toHaveBeenCalledWith(500)
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: 'There was an internal server error', isSuccess: false
        })
    })
})