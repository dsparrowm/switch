import request from 'supertest';
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import app from '../../../src/server';
import prisma from '../../../src/db';
import generateOtp from '../../../src/helpers/generateOtp';
import hashPassword from '../../helpers/hashPassword';


describe('POST /auth/otp', () => {
  let userId: number;

  beforeAll(async () => {
    // Create a test user in the database
    const userExists = await prisma.user.findUnique({ where: { email: 'test3@example.com' } });
    if (userExists) {
      await prisma.oTP.deleteMany({ where: { userId: userExists.id } });
      await prisma.user.delete({ where: { email: userExists.email } });
      console.log('User deleted');
    } else {
      console.log('User does not exist');
    }
    
  });

  afterAll(async () => {
    // Clean up the test user from the database
    await prisma.oTP.deleteMany({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } });

  });

  test('should return success for valid OTP', async () => {
    const user = await prisma.user.create({
      data: {
        email: 'test3@example.com',
        password: 'testpassword',
        name: 'Test3 User',
      },
    });
    userId = user.id;
    const validOtp = await generateOtp();
    await prisma.oTP.create({
        data: {
            code: await hashPassword(String(validOtp)),
            userId,
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
        
    })
    const response = await request(app)
      .post('/auth/otp')
      .send({ userId, otp: String(validOtp) });

    expect(response.status).toBe(200);
    expect(response.body.isSuccess).toBe(true);
    expect(response.body.message).toBe('Valid Otp');
  });

  test('should return error for invalid OTP', async () => {
    const invalidOtp = '123456';
    const response = await request(app)
      .post('/auth/otp')
      .send({ userId, otp: invalidOtp });

    expect(response.status).toBe(404);
    expect(response.body.isSuccess).toBe(false);
    expect(response.body.message).toBe('Invalid Otp');
  });

  test('should return error for invalid request body', async () => {
    const response = await request(app)
      .post('/auth/otp')
      .send({ userId });

    expect(response.status).toBe(400);
    expect(response.body.isSuccess).toBe(false);
    expect(Array.isArray(response.body.message)).toBe(true);
  });

  test('should return error for invalid user', async () => {
    const invalidUserId = 999999;
    const response = await request(app)
      .post('/auth/otp')
      .send({ userId: invalidUserId, otp: '123456' });
    
    expect(response.status).toBe(404);
    expect(response.body.isSuccess).toBe(false);
    expect(response.body.message).toBe('Invalid userId');
  });

    test('should return 500 error for expired OTP or unexpected error', async () => {
      const user = await prisma.user.create({
        data: {
          email: 'test4@example.com',
          password: 'testpassword',
          name: 'Test4 User',
        },
      });
      userId = user.id;
      const expiredOtp = await generateOtp();
      await prisma.oTP.create({
        data: {
          code: await hashPassword(String(expiredOtp)),
          userId,
          createdAt: new Date(),
          expiresAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Set expiresAt to a past date
        },
      });
      const response = await request(app)
        .post('/auth/otp')
        .send({ userId, otp: String(expiredOtp) });

      expect(response.status).toBe(500);
      expect(response.body.isSuccess).toBe(false);
      expect(response.body.message).toBe('Expired otp');
    });
});