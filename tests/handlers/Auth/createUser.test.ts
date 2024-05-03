import { describe, beforeEach, test, expect, vi } from 'vitest';
import { Request, Response } from 'express';
import createUser from '../../../src/handlers/authentication/createUser';
import prisma from '../../../src/__mocks__/db';
import hashPassword from '../../../src/helpers/hashPassword';
import createJWT from '../../../src/helpers/createJwt';

vi.mock('../../../src/db');
vi.mock('../../../src/helpers/hashPassword', () => ({
  default: vi.fn(),
}));

vi.mock('../../../src/helpers/createJwt', () => ({
  default: vi.fn(),
}));

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
    
    test("it should Create a new user if the user doesn't exist", async () => {
      const hashedPassword = 'hashedPassword123';
      const token = 'testToken';

      const date = new Date();
      const user = {
          id: 1,
          name: "test user",
          email: "testuser@gmail.com",
          createdAt: date,
          updatedAt: date
      }

      vi.mocked(hashPassword).mockResolvedValue(hashedPassword)
      prisma.user.findUnique.mockResolvedValue(null)
      prisma.user.create.mockResolvedValue({...user, password: hashedPassword})
      vi.mocked(createJWT).mockResolvedValue(token);
      
      
      await createUser(mockRequest, mockResponse)

      expect(hashPassword).toHaveBeenCalledWith('password');
      expect(createJWT).toHaveBeenCalledWith(user);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: {
          email: "test@gmail.com"
        }
      })
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          email: "test@gmail.com",
          password: hashedPassword,
          name: "test user"
        }
      })
    })
})