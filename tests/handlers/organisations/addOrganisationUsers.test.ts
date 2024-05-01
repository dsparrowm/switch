import { describe, beforeEach, afterAll, test, expect, vi } from 'vitest';
import { Request, Response } from 'express';
import addOrganisationUsers from '../../../src/handlers/organisations/addOrganisationUsers';
import getOrganisationUsers from '../../../src/handlers/organisations/getOrganisationUsers';
import { addUserToOrganisationSchema, getOrganisationUsersSchema } from '../../../src/utils/validationSchemas';
import prisma from '../../../src/__mocks__/db';

vi.mock('../../../src/db');

const mockRequest = {
  body: {
    userId: 2,
    orgId: 35
  }
} as unknown as Request;

const mockResponse = {
  status: vi.fn().mockReturnThis(),
  json: vi.fn()
} as unknown as Response;

describe('addOrganisationUsers', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });
  afterAll(() => {
    vi.resetAllMocks();
  })

  test('It should add a user to an organisation', async () => {
    const date = new Date();
    prisma.userOrganisation.findUnique.mockResolvedValue(null);
    prisma.userOrganisation.create.mockResolvedValue({ userId: 2, organisationId: 35, createdAt: date, updatedAt: date, id: 1 });
    prisma.department.findMany.mockResolvedValue([
      { id: 1, name: 'General', organisationId: 1, createdAt: date, updatedAt: date },
      { id: 2, name: 'Announcements', organisationId: 1, createdAt: date, updatedAt: date }
    ]);
    prisma.userDepartment.create.mockResolvedValueOnce({ id: 1, userId: 2, departmentId: 1 , createdAt: date, updatedAt: date});
    prisma.userDepartment.create.mockResolvedValueOnce({ id: 1, userId: 2, departmentId: 2 , createdAt: date, updatedAt: date});

    await addOrganisationUsers(mockRequest, mockResponse);

    expect(prisma.userOrganisation.findUnique).toHaveBeenCalledWith({
      where: { userId_organisationId: { userId: 2, organisationId: 35 } }
    });
    expect(prisma.userOrganisation.create).toHaveBeenCalledWith({
      data: { userId: 2, organisationId: 35 }
    });
    expect(prisma.department.findMany).toHaveBeenCalledWith({
      where: {
        OR: [
          { AND: [{ organisationId: 35 }, { name: 'General' }] },
          { AND: [{ organisationId: 35, name: 'Announcements' },] }
        ]
      }
    });
    expect(prisma.userDepartment.create).toHaveBeenCalledTimes(2);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'User added successfully',
      isSuccess: true
    });
  });

  test('It should return an error if the user is already in the organisation', async () => {
    const date = new Date()
    prisma.userOrganisation.findUnique.mockResolvedValue({ id: 1, userId: 1, organisationId: 1, createdAt: date, updatedAt: date });

    await addOrganisationUsers(mockRequest, mockResponse);

    expect(prisma.userOrganisation.findUnique).toHaveBeenCalledWith({
      where: { userId_organisationId: { userId: 2, organisationId: 35 } }
    });
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: 'User already exists in the organisation',
      isSuccess: false
    });
  });

  test('It should return a Zod error if the request body is invalid', async () => {
    const invalidRequest = {
      body: {
        // Missing userId or orgId
      }
    } as unknown as Request;

    await addOrganisationUsers(invalidRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: expect.any(Array),
      isSuccess: false
    });
  });

  test('it should return a 500 error if an error occurs', async () => {
    prisma.userOrganisation.findUnique.mockRejectedValue(new Error('Test Error'));

    await addOrganisationUsers(mockRequest, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Test Error",
      isSuccess: false
    });
  });
});