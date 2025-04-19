import { neon, neonConfig } from '@neondatabase/serverless';
import {getDbUrl} from  '../lib/secrets.mjs';
import { drizzle } from 'drizzle-orm/neon-http';

async function dbClient() {
    const dbUrl = await getDbUrl();
    neonConfig.fetchConnectionCache = true;
    const sql = neon(dbUrl);
    return sql;
}

async function getDbClientDrizzle() {
    const dbUrl = await getDbUrl();
    return drizzle(dbUrl); 
}

export { dbClient, getDbClientDrizzle };