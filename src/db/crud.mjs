import { getDbClientDrizzle } from "./clients.mjs";
import { leads } from "./schemas.mjs";
async function addNewLead(email) {
    const db = await getDbClientDrizzle();
    const result = await db.insert(leads).values({ email }).returning({ id : leads.id });
    if (result.length > 0) {
        return result[0];
    } else {
        throw new Error("Failed to create lead");
    }  
}

async function getLeads() {
    const db = await getDbClientDrizzle();
    const result = await db.select().from(leads).orderBy(leads.createdAt, 'desc').limit(10);
    return result;
}

async function getLeadById(id) {
    const db = await getDbClientDrizzle();
    const result = await db.select().from(leads).where(leads.id.equals(id)).limit(1);
    if (result.length > 0) {
        return result[0];
    } else {
        throw new Error("Lead not found");
    }
}

export { addNewLead, getLeads, getLeadById };