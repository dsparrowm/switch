import { describe, beforeEach, expect, test, vi } from 'vitest';
import { Request, Response } from 'express';
import getOrganisationById from '../../../src/Handlers/organisations/getOrganisationById';
import prisma from '../../../src/__mocks__/db';
import {getOrganisationSchema} from '../../../src/utils/validationSchemas'

vi.mock('../../../src/db');

const mockRequest = {
    query: {
      orgId: 1
    }
  } as unknown as Request;
  
  const mockResponse = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn()
  } as unknown as Response;

describe('Get organisation', () => {
    test('It should get an organisation by id', async () => {
        const date = new Date();
        prisma.organisation.findUnique.mockResolvedValue({
            id: 1,
            name: 'Test Organisation',
            inviteLink: 'https://invite.example.com/1',
            createdAt: date,
            updatedAt: date,
          });

          await getOrganisationById(mockRequest, mockResponse);

          expect(prisma.organisation.findUnique).toHaveBeenCalledWith({
            where: { id: 1 },
            include: { departments: true }
          });
          expect(mockResponse.status).toHaveBeenCalledWith(200);
          expect(mockResponse.json).toHaveBeenCalledWith({
            message: 'Organisation found',
            org: {
              id: 1,
              name: 'Test Organisation',
              inviteLink: 'https://invite.example.com/1',
              createdAt: date,
              updatedAt: date,
            },
            isSuccess: true,
          });
    });

    test('It should return a 404 error when the organisation is not found', async () => {
        prisma.organisation.findUnique.mockResolvedValue(null);
    
        await getOrganisationById(mockRequest, mockResponse);
    
        expect(prisma.organisation.findUnique).toHaveBeenCalledWith({
          where: { id: 1 },
          include: { departments: true }
        });
        expect(mockResponse.status).toHaveBeenCalledWith(404);
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: 'Organisation not found',
          isSuccess: false
        });
      });

    test('It should return a 400 error when the request query is invalid', async () => {
        const invalidRequest = {
            query: {
            // Missing orgId
            }
        } as unknown as Request;

        await getOrganisationById(invalidRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: expect.any(Array),
            isSuccess: false
        });
    });

    test('It should return a 400 error when the request query is invalid', async () => {
        const invalidRequest = {
          query: {
            // Missing orgId
          }
        } as unknown as Request;
    
        await getOrganisationById(invalidRequest, mockResponse);
    
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: expect.any(Array),
          isSuccess: false
        });
    });
    
    test('It should return a 500 error when an unexpected error occurs', async () => {
        const error = new Error('Unexpected error');
        prisma.organisation.findUnique.mockRejectedValue(error);
    
        await getOrganisationById(mockRequest, mockResponse);
    
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
          message: expect.any(Array),
          isSuccess: false
        });
    });
});