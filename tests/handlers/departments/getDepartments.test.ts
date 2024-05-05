import { describe, beforeEach, test, expect, vi, } from 'vitest';
import { Request, Response } from 'express';
import getDepartments from '../../../src/handlers/departments/getDepartments';
import prisma from '../../../src/__mocks__/db';

vi.mock('../../../src/db');

const mockRequest = {
  query: {
    organisationId: 1
  }
} as unknown as Request;

const mockResponse = {
    status: vi.fn(),
    json: vi.fn()
  } as unknown as Response;


describe('Get Departments', () => {
    beforeEach(() => {
        vi.resetAllMocks();
      });
    
    test('It should Retrieve all departments in an organisation', async () => {
        const date = new Date()
        
        const result = await redis.get('departments:10000000')
        prisma.department.findMany.mockResolvedValue([
            {
                id: 1,
                name: "Announcements",
                organisationId: 1,
                createdAt: date,
                updatedAt: date
            },
            {
                id: 2,
                name: "General",
                organisationId: 1,
                createdAt: date,
                updatedAt: date
            }
        ])

        await getDepartments(mockRequest, mockResponse)
  
        expect(prisma.department.findMany).toHaveBeenCalledWith({
            where: {organisationId: 1}
        })
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({
            departments: [
                {
                    id: 1,
                    name: "Announcements",
                    organisationId: 1,
                    createdAt: date,
                    updatedAt: date
                },
                {
                    id: 2,
                    name: "General",
                    organisationId: 1,
                    createdAt: date,
                    updatedAt: date
                }
            ],
            isSuccess: true,
            message: "Found"
        })
    })

    test('it should return a 404 error when the department does not exist', async () => {
        const mockRequest = {
            query: {
              organisationId: 500
            }
          } as unknown as Request;

        prisma.department.findMany.mockResolvedValue([]);
    
        await getDepartments(mockRequest, mockResponse);
    
        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: 'No departments found', isSuccess: false 
        });
    });

    test('it should return a 500 error if an error occurs', async () => {
        prisma.department.findMany.mockRejectedValue(new Error('Test Error'));
    
        await getDepartments(mockRequest, mockResponse);
    
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: "Test Error",
          isSuccess: false
        });
    });

    test('It should return a Zod validation error if the request body is invalid', async () => {
        const invalidRequest = {
         body: {
           //organisationId is not a number
           organisationId: "test"
         }
        } as unknown as Request;
    
        await getDepartments(invalidRequest, mockResponse);
    
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: expect.any(Array),
          isSuccess: false
        });
    });
})