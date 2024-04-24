import { describe, beforeEach, test, expect, vi } from 'vitest';
import { Request, Response } from 'express';
import createUser from '../../../src/handlers/authentication/createUser';
import prisma from '../../../src/__mocks__/db';
import hashPassword from '../../../src/helpers/hashPassword';

vi.mock('../../../src/db');


const mockRequest = {
  body: {
    email: "test@gmail.com",
    password: "password",
    name: "test user"
  }
} as unknown as Request

const mockResponse = {
  status: vi.fn().mockReturnThis(),
  json: vi.fn()
} as unknown as Response

describe('Create User', () => {
    beforeEach(() => {
        vi.resetAllMocks();
      });
    
    test('Create a new user', async () => {
      const date = new Date();
      const user = {
          id: 1,
          name: "test user",
          email: "testuser@gmail.com",
          password: "password",
          createdAt: date,
          updatedAt: date
      }
      prisma.user.findUnique.mockResolvedValue(null)
      prisma.user.create.mockResolvedValue(user)
      
      await createUser(mockRequest, mockResponse)

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: {
          email: "test@gmail.com"
        }
      })
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          email: "test@gmail.com",
          password: await hashPassword('password'),
          name: "test user"
        }
      })
    })
})