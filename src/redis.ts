import dotenv from 'dotenv';
dotenv.config()

let Redis: any;

const getRedisUrl = () => {
    if (process.env.REDIS_URL) {
        return process.env.REDIS_URL;
    }
    throw new Error('REDIS_URL environment variable not set');
}

const initRedis = () => {
    // Move the import statement inside this function
    Redis = require('ioredis').Redis;
    const redisUrl = getRedisUrl();
    const redis = new Redis(redisUrl);
    return redis;
  };

export default initRedis();