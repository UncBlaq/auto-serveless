import { getDbClientDrizzle } from "./clients.mjs";
import * as schemas from "./schemas.mjs";

async function addNewLead(email) {
    const db = await getDbClientDrizzle();
    const result = await db.insert(schemas.leads).values({ email }).returning({ id: leads.id });
    if (result.length > 0) {
        return result[0];
    } else {
        throw new Error("Failed to create lead");
    }  
}

async function getLeads() {
    const db = await getDbClientDrizzle();
    const result = await db.select().from(schemas.leads).orderBy(schemas.leads.created_at.desc()).limit(10);
    return result;
}

async function getLeadById(id) {
    const db = await getDbClientDrizzle();
    const result = await db.select().from(schemas.leads).where(schemas.leads.id.equals(id)).limit(1);
    if (result.length > 0) {
        return result[0];
    } else {
        throw new Error("Lead not found");
    }
}

export { addNewLead, getLeads, getLeadById };