import { describe, beforeEach, test, expect, vi } from 'vitest';
import { Request, Response } from 'express';
import createOrganisation from '../../../src/handlers/organisations/createOrganisation';
import prisma from '../../../src/__mocks__/db';

vi.mock('../../../src/db');

const mockRequest = {
  body: {
    userId: 1,
    name: "Test Organisation"
  }
} as unknown as Request;

const mockResponse = {
  status: vi.fn(),
  json: vi.fn()
} as unknown as Response;

describe('createOrganisation', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });
  
  test('It should create a new Organisation', async () => {

    const date = new Date();
    // Mock the Prisma client responses
    prisma.user.findUnique.mockResolvedValue({
      id: 1,
      name: "Test User",
      email: "testuser@example.com",
      password: "password",
      createdAt: date,
      updatedAt: date
    });

    prisma.organisation.create.mockResolvedValue({
      id: 1,
      name: "Test Organisation",
      inviteLink: "https://invite.example.com/1",
      createdAt: date,
      updatedAt: date
    });

    prisma.role.create.mockResolvedValue({
      id: 1,
      name: "admin",
      createdAt: date,
      updatedAt: date,
    });

    prisma.userRole.create.mockResolvedValue({
      id: 1,
      userId: 1,
      roleId: 1,
      organisationId: 1,
      createdAt: date,
      updatedAt: date,
    });

    prisma.department.create.mockResolvedValueOnce({
      id: 1,
      name: "General",
      organisationId: 1,
      createdAt: date,
      updatedAt: date
    });

    prisma.department.create.mockResolvedValueOnce({
      id: 2,
      name: "Announcements",
      organisationId: 1,
      createdAt: date,
      updatedAt: date
    });

    prisma.department.findMany.mockResolvedValue([
      { id: 1, name: "General", organisationId: 1 , createdAt: new Date(),
      updatedAt: date},
      { id: 2, name: "Announcements", organisationId: 1, createdAt: new Date(),
      updatedAt: new Date()}
    ]);

    prisma.userDepartment.create.mockResolvedValue({
      id: 1,
      userId: 1,
      departmentId: 1,
      createdAt: date,
      updatedAt: date
    });

    prisma.userDepartment.create.mockResolvedValue({
      id: 2,
      userId: 1,
      departmentId: 2,
      createdAt: date,
      updatedAt: date
    });

    prisma.userOrganisation.create.mockResolvedValue({
      id: 1,
      userId: 1,
      organisationId: 1,
      createdAt: date,
      updatedAt: date
    });

    await createOrganisation(mockRequest, mockResponse);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: 1 }
    });
    expect(prisma.organisation.create).toHaveBeenCalledWith({
      data: {
        name: "Test Organisation",
        inviteLink: expect.any(String)
      }
    });
    expect(prisma.role.create).toHaveBeenCalledWith({
      data: {
        name: "admin"
      }
    });
    expect(prisma.userRole.create).toHaveBeenCalledWith({
      data: {
        userId: 1,
        roleId: 1,
        organisationId: 1
      }
    });
    expect(prisma.department.create).toHaveBeenCalledTimes(2);
    expect(prisma.department.findMany).toHaveBeenCalledWith({
      where: {
        organisationId: 1
      }
    });
    expect(prisma.userDepartment.create).toHaveBeenCalledTimes(2);
    expect(prisma.userOrganisation.create).toHaveBeenCalledWith({
      data: {
        userId: 1,
        organisationId: 1
      }
    });
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'Organization created successfully!',
      isSuccess: true,
      org: {
        id: 1,
        name: "Test Organisation",
        inviteLink: "https://invite.example.com/1",
        createdAt: date,
        updatedAt: date
      }
    });
  });

  test('It should return a Zod validation error if the request body is invalid', async () => {
    const invalidRequest = {
     body: {
       //missing userId
       name: "Test Organisation"
     }
    } as unknown as Request;

    await createOrganisation(invalidRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: expect.any(Array),
      isSuccess: false
    });
  });

  test('it should return a 500 error if an error occurs', async () => {
    prisma.user.findUnique.mockRejectedValue(new Error('Test Error'));

    await createOrganisation(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: "Test Error",
      isSuccess: false
    });
  });
  
  test('it should return a 404 error when the user does not exist', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    await createOrganisation(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "User does not exist, please create an account",
    });
  });
});