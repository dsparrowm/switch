import { describe, it, expect } from 'vitest';
import bcrypt from 'bcrypt';
import comparePassword from '../../src/helpers/comparePassword';

describe('comparePassword', () => {
  it('should return true when the password matches the hash', async () => {
    const password = 'myPassword';
    const hash = await bcrypt.hash(password, 10);

    const result = await comparePassword(password, hash);

    expect(result).toBe(true);
  });

  it('should return false when the password does not match the hash', async () => {
    const password = 'myPassword';
    const hash = await bcrypt.hash('differentPassword', 10);

    const result = await comparePassword(password, hash);

    expect(result).toBe(false);
  });
});