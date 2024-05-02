import { describe, beforeEach, test, expect, vi, afterEach } from 'vitest';
import { Request, Response } from 'express';
import getOrganisationUsers from '../../../src/handlers/organisations/getOrganisationUsers';
import prisma from '../../../src/__mocks__/db';
import mockIoRedis from 'ioredis-mock';

vi.mock('../../../src/db');
vi.mock('ioredis', () => mockIoRedis);

const mockRequest = {
  body: {
    orgId: 1
  }
} as unknown as Request;

const mockResponse = {
  status: vi.fn(),
  json: vi.fn()
} as unknown as Response;

describe('Get Organisation users', () => {
  let redis;

  beforeEach(() => {
    redis = new mockIoRedis({
      data: {
        // Initial state of the mocked Redis data
        'org:1:users': JSON.stringify([
          { id: 1, name: 'John' },
          { id: 2, name: 'Jane' },
        ]),
      },
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  test('It should get all users in an organisation', async () => {
    redis.get = vi.fn()
    const date = new Date();
    const users = [
      {
        id: 1,
        userId: 1,
        organisationId: 1,
        user: { id: 1, name: 'User 1', email: 'user1@example.com' },
        organisation: { id: 1, name: 'Organisation 1' },
        createdAt: date,
        updatedAt: date
      },
      {
        id: 2,
        userId: 2,
        organisationId: 1,
        user: { id: 2, name: 'User 2', email: 'user2@example.com' },
        organisation: { id: 1, name: 'Organisation 1' },
        createdAt: date,
        updatedAt: date
      }
    ];

    prisma.organisation.findUnique.mockResolvedValue({
      id: 1,
      name: "Test Organisation",
      inviteLink: "https://invite.example.com/1",
      createdAt: date,
      updatedAt: date
    })
    prisma.userOrganisation.findMany.mockResolvedValue(users);

    await getOrganisationUsers(mockRequest, mockResponse);

    expect(prisma.organisation.findUnique).toHaveBeenCalledWith({
      where: {id: 1}
    })
    expect(prisma.userOrganisation.findMany).toHaveBeenCalledWith({
      where: { organisationId: 1 },
      include: {
        user: true,
        organisation: true
    }
    });
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      users,
      isSuccess: true,
      NoOfUsers: users.length
    });
  })

  test('It should return a 404 error if no organisation is found', async () => {
    const invalidMockRequest = {
      body: {
        orgId: 200
      }
    } as unknown as Request;

    const invalidMockResponse = {
      status: vi.fn(),
      json: vi.fn()
    } as unknown as Response;
    prisma.organisation.findUnique.mockResolvedValue(null);
  
    await getOrganisationUsers(invalidMockRequest, invalidMockResponse);
  
    
    expect(prisma.organisation.findUnique).toHaveBeenCalledWith({
        where: {id: 200}
      })
    expect(invalidMockResponse.status).toHaveBeenCalledWith(404);
    expect(invalidMockResponse.json).toHaveBeenCalledWith({
      message: 'No organization found',
      isSuccess: false
    });
  })

  test('It should return a Zod error if the request body is invalid', async () => {
    const invalidRequest = {
      body: {
        // orgId cannot be parsed to a number
        orgId: "hen"
      }
    } as unknown as Request;

    const invalidMockResponse = {
      status: vi.fn(),
      json: vi.fn()
    } as unknown as Response;

    await getOrganisationUsers(invalidRequest, invalidMockResponse);

    expect(invalidMockResponse.status).toHaveBeenCalledWith(400);
    expect(invalidMockResponse.json).toHaveBeenCalledWith({
      error: expect.any(Array),
      isSuccess: false
    });
  });
})