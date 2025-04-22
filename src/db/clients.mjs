import { neon, neonConfig } from '@neondatabase/serverless';
import {getDbUrl} from  '../lib/secrets.mjs';
import { drizzle } from 'drizzle-orm/neon-http';

neonConfig.fetchConnectionCache = true;

let cachedSql = null;

const dbClient = async function dbClient() {
    console.log("Checking for cached DB client...");
    if (cachedSql) {
      console.log("Using cached DB client");
      return cachedSql;
    }
  
    console.log("Fetching DB URL...");
    const dbUrl = await getDbUrl();
    console.log("Initializing DB client");
    neonConfig.fetchConnectionCache = true;
  
    cachedSql = neon(dbUrl);
    return cachedSql;
  }

async function getDbClientDrizzle() {
  const dbUrl = await getDbUrl();
  if (!dbUrl) {
    throw new Error('Missing DB URL');
  }
  const sql = neon(dbUrl);     // ✅ This turns the string into a working client
  const db = drizzle(sql); 
  return db 
}


export { dbClient, getDbClientDrizzle };