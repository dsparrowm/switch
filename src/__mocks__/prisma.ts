import prisma from './db'
import { vi } from 'vitest'

vi.mock('./db');

const MockPrisma = prisma;

export default MockPrisma;