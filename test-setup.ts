import ioredis from 'ioredis';
import mockIoRedis from 'ioredis-mock';
import { vi } from 'vitest';

// Mock the Redis client
vi.mock('ioredis', () => mockIoRedis);

// I'm not able to mock this ioredis client. For some reason, mockRedis doesn't work and I couldn't get this test-setup to work