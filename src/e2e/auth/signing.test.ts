import request from 'supertest';
import { describe, test, expect, beforeAll, afterAll, vi } from 'vitest';
import app from '../../../src/server';
import prisma from '../../../src/db';
import hashPassword from '../../helpers/hashPassword';


describe('/auth/login', () => {
  const testUser = {
    email: 'test@example.com',
    password: 'testpassword',
    name: "test user"
  };


  beforeAll(async () => {
    // Create a test user in the database
    const hashedPassword = await hashPassword(testUser.password);
    await prisma.user.create({
      data: {
        email: testUser.email,
        password: hashedPassword,
        name: testUser.name,
        // Add any other required fields
      },
    });
  });

  afterAll(async () => {
    // Clean up the test data after all tests are completed
    await prisma.user.delete({ where: { email: testUser.email } });
  });

  test('it should allow users to login with valid credentials', async () => {
    const response = await request(app).post('/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });
    expect(response.status).toBe(200);
    expect(response.body.isSuccess).toBe(true);
    expect(response.body.message).toBe('Login successful');
    expect(response.body.token).toBeDefined();
    expect(response.body.user).toBeDefined();
  });

  test('It should return 401 if user provides invalid password', async () => {
    const response = await request(app).post('/auth/login').send({
    email: 'test@example.com',
    password: 'wrongpassword',
    });
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Invalid password');
});

  //Add more test cases as 
  test('It should return 404 if user does not exist', async () => {
    const response = await request(app).post('/auth/login').send({
      email: 'testemail@wrong.com',
      password: 'testpassword',
    });
    expect(response.status).toBe(404);
    expect(response.body.isSuccess).toBe(false);
    expect(response.body.message).toBe('No user found');
});


  test('It should return 400 if request body is invalid', async () => {
        const response = await request(app).post('/auth/login').send({
        email: testUser.email,
        });
        expect(response.status).toBe(400);
        expect(response.body.isSuccess).toBe(false);
        expect(Array.isArray(response.body.message)).toBe(true)
    });
  
});