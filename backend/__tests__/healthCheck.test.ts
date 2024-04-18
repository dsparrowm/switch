import {describe, expect, it, beforeEach, vi } from 'vitest';
import { Request, Response } from 'express';
import healthCheck from '../src/Handlers/healthCheck';


vi.mock('../src/db')

describe('healthCheck', () => {
    
    it("should return 'Server is running...'", async () => {
        const mockRequest = {} as Request;
        const mockResponse = {
            send: vi.fn(),
            status: vi.fn()
        } as unknown as Response;
    
        healthCheck(mockRequest, mockResponse);
        
    });
    });