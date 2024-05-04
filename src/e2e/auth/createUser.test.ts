import request from 'supertest';
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import app from '../../../src/server';
import prisma from '../../../src/db';
import hashPassword from '../../helpers/hashPassword';

describe('POST /auth/signup', () => {
  const testUser = {
    email: 'test2@example.com',
    password: 'test2password',
    name: 'Test2 User',
  };

  // beforeAll(async () => {
  //   // Ensure the test user doesn't exist in the database
  //   await prisma.user.delete({ where: { email: testUser.email } });
  // });

  afterAll(async () => {
    // Clean up the test user from the database
    await prisma.user.delete({ where: { email: testUser.email } });
  });

  test('should create a new user with valid data', async () => {
    const response = await request(app)
      .post('/auth/signup')
      .send(testUser);

    expect(response.status).toBe(200);
    expect(response.body.isSuccess).toBe(true);
    expect(response.body.message).toBe('Account Created successfully');
    expect(response.body.token).toBeDefined();
    expect(response.body.createdUser).toBeDefined();
    expect(response.body.createdUser.email).toBe(testUser.email);
    expect(response.body.createdUser.name).toBe(testUser.name);
    expect(response.body.createdUser.password).toBeUndefined();
  });

  test('should return an error if user already exists', async () => {
    const response = await request(app)
      .post('/auth/signup')
      .send(testUser);

    expect(response.status).toBe(409);
    expect(response.body.isSuccess).toBe(false);
    expect(response.body.message).toBe('User already Exists');
  });

  test('should return an error for invalid request body', async () => {
    const invalidUser = {
      email: 'invalidemail',
      password: 'shortpw',
    };

    const response = await request(app)
      .post('/auth/signup')
      .send(invalidUser);

    expect(response.status).toBe(400);
    expect(response.body.isSuccess).toBe(false);
    expect(Array.isArray(response.body.message)).toBe(true);
  });
});