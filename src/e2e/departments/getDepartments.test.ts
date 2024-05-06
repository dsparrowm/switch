import request from 'supertest';
import app from '../../../src/server';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import prisma from '../../db';
import redis from '../../redis';

describe('GET /departments', async () => { 
    let organisationId: number;
    let token: string

    beforeAll(async () => {
        // Setup
        const createdOrg = await prisma.organisation.create({
            data: {
                name: 'Test Org',
                inviteLink: 'testlink',
            },
        });
        organisationId = createdOrg.id
        await prisma.department.createMany({
            data: [
                { name: 'General', organisationId },
                { name: 'Announcements', organisationId },
            ],
        });

    })
    afterAll(async () => {
        // Cleanup
        await prisma.department.deleteMany({
            where: {
                organisationId
            },
        });
        await prisma.organisation.delete({
            where: {
                id: organisationId
            },
        });
        await prisma.user.delete({
            where: {email: "testmail@mail.com"}
        })
    });

    it('should return a list of departments', async () => {
        const result = await request(app)
            .post('/auth/signup')
            .send({ email: 'testmail@mail.com', password: "password", name: "mark" })
        token = result.body.token
        const response = await request(app)
            .get('/api/departments')
            .set('Authorization', `Bearer ${token}`)
            .query({ organisationId });
        // expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message');
        // expect(Array.isArray(response.body.departments)).toBe(true);
        expect(response.body.message).toBe('Found');
    });

    it('should return an error if the request is invalid', async () => {
        const response = await request(app)
            .get('/api/departments')
            .set('Authorization', `Bearer ${token}`)
            .query({ invalidParam: 'value' });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message');
        expect(response.body.isSuccess).toBe(false);
    });
});