import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import {Pool, neonConfig} from '@neondatabase/serverless'
dotenv.config();
import ws from 'ws';
import {drizzle} from 'drizzle-orm/neon-serverless'
import * as schema from '../db/schemas.mjs';
import { getDbUrl } from '../lib/secrets.mjs'; 
import {migrate} from 'drizzle-orm/postgres-js/migrator'


async function performMigration() {
    console.log("Starting migration...");
    const dbUrl = await getDbUrl(); 
    if (!dbUrl) {
        console.error("Database URL is not defined. Exiting migration.");
        return;
    }
    // neon serverless pool
    const pool = new Pool({
        connectionString: dbUrl,
    });
    pool.on('error', (err) => {
        console.error('Unexpected error on idle client', err);
        process.exit(-1);
    });
    const client = await pool.connect();

    try {
        await client.query('BEGIN');
        const db = await drizzle(client, {schema});
        await migrate(db, { migrationsFolder: 'src/migrations' });
        await client.query('COMMIT');
    } catch (error) {
        console.error("Error during migration:", error);
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
        await pool.end();
        console.log("Migration completed and connection closed.");
}}

const __filename = fileURLToPath(import.meta.url);
const isMain = path.resolve(process.argv[1]) === path.resolve(__filename);

if (isMain) {
    performMigration()
        .then(() => {
            console.log("Migration completed successfully.");
            process.exit(0);
        })
        .catch((error) => {
            console.error("Migration failed:", error);
            process.exit(1);
        });
}
