import ioredis from 'ioredis';
import mockIoRedis from 'ioredis-mock';
import { vi } from 'vitest';

// Mock the Redis client
vi.mock('ioredis', () => mockIoRedis);

// Additional setup code if needed