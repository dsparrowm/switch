import { describe, beforeEach, test, expect, vi } from 'vitest';
import { Request, Response } from 'express';
import updateOrganisation from '../../../src/handlers/organisations/updateOrganisation';
import prisma from '../../../src/__mocks__/db';

vi.mock('../../../src/db');

const mockRequest = {
    body: {
        orgId: 1,
        name: "Test Organisation"
    }
} as unknown as Request;

const mockResponse = {
    status: vi.fn(),
    json: vi.fn()
} as unknown as Response;

describe('Update Organisation', () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });
    
    test('It should update an Organisation', async () => {
        const date = new Date();
        // Mock the Prisma client responses
        prisma.organisation.findUnique.mockResolvedValue({
            id: 1,
            name: "Test Organisation",
            inviteLink: "https://invite.example.com/1",
            createdAt: date,
            updatedAt: date
        })

        prisma.organisation.update.mockResolvedValue({
            id: 1,
            name: "Updated Organisation",
            createdAt: date,
            updatedAt: date,
            inviteLink: "https://invite.example.com/1",
        });

        const updateRequest = {
            body: {
                orgId: 5,
                name: "Updated Organisation"
            }
        } as unknown as Request;

        const updateResponse = {
            status: vi.fn(),
            json: vi.fn()
        } as unknown as Response;
    
        await updateOrganisation(updateRequest, updateResponse);
    
        expect(prisma.organisation.update).toHaveBeenCalledWith({
            where: {id: 5},
            data: {name: "Updated Organisation"}
        });
        expect(updateResponse.status).toHaveBeenCalledWith(200);
        expect(updateResponse.json).toHaveBeenCalledWith({message: "successful", isSuccess: true, updatedOrg: {
            id: 1,
            name: "Updated Organisation",
            createdAt: date,
            updatedAt: date,
            inviteLink: "https://invite.example.com/1",
        }});
    });
    
    test('It should return an error if the request is invalid', async () => {
        const invalidMockRequest = {
        body: {
            orgId: 1,
            name: 123
        }
        } as unknown as Request;
    
        const mockResponse = {
        status: vi.fn(),
        json: vi.fn()
        } as unknown as Response;
    
        await updateOrganisation(invalidMockRequest, mockResponse);
    
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
        isSuccess: false,
        message: [
        {
            code: 'invalid_type',
            expected: "string",
            message: 'Expected string, received number',
            received: "number",
            path: ["name"],
        },
            ]
        });
    })


    test('It should return a 404 error if organisation not found', async () => {
        const errorMockRequest = {
        body: {
            orgId: 200,
            name: "Test Organisation"
        }
        } as unknown as Request;
    
        const mockResponse = {
        status: vi.fn(),
        json: vi.fn()
        } as unknown as Response;
    
        prisma.organisation.findUnique.mockResolvedValue(null);
    
        await updateOrganisation(errorMockRequest, mockResponse);
    
        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({message: "Organisation not found", isSuccess: false});
    });

    test('It should return a 500 error if an unexpected error occurs', async () => {
        
        const error = new Error("Test Error");
        prisma.organisation.findUnique.mockRejectedValue(error);
    
        await updateOrganisation(mockRequest, mockResponse);
    
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({message: "Internal server Error", isSuccess: false});
    });
});
