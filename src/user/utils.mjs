import { redisClient, connectRedis } from "../handler.mjs";

import { getDbClientDrizzle } from "../db/clients.mjs"

import { eq } from 'drizzle-orm';
import { users } from '../db/schemas.mjs'; // adjust your schema file path

const checkExistingEmail = async (req, res, next) => {
  try {
    console.log('Drizie....')
    const db = await getDbClientDrizzle();
    console.log('checking ma...')
    const result = await db.select().from(users).where(eq(users.email, req.body.email)).limit(1);
    console.log('Check complete')
    
    if (result.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    next(); // Proceed if email does not exist
  } catch (error) {
    return res.status(500).json({ message: 'Server error while checking email' });
  }
};

export { checkExistingEmail };
