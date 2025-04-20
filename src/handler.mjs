import serverless from "serverless-http";
import express from "express";
import { addNewLead, getLeads } from "./db/crud.mjs";
import { validateLeeds } from "./validator/validateLeeds.mjs";
// fix or remove this import
import bodyParser from 'body-parser';


// Prod
import { dbClient } from "./db/clients.mjs";

const app = express();
app.use(bodyParser.json()); 
app.use(express.json());


const STAGE = process.env.STAGE || 'deployment';


// dev
// async function dbClient() {
//   const sql = neon(process.env.DATABASE_URL);
//   return sql;
// }

app.get("/", async (req, res, next) => {
  const sql = await dbClient();
  const now = Date.now();
  const [row] = await sql`SELECT now();`
  const delta = row.now.getTime() - now;
  return res.status(200).json({
    result: delta,
    message: "Hello from root!",
    delta: delta,
    stage : STAGE
  });
});

app.get("/hello", (req, res, next) => {
  return res.status(200).json({
    message: "Hello from path!",
  });
});

app.get("/leeds", async (req, res, next) => {
  const leads = await getLeads();
  return res.status(200).json({
    message: "Hello from path!",
  });
});

app.post("/leeds", async (req, res, next) => {
  const payload = await req.body; 
  const { data, error, message } = await validateLeeds(payload);
  if (error) {
    return res.status(400).json({
      error: error,
      message: message,
    });
  }
  const { email } = data;
  const { id } = await addNewLead(email);
  if (!id) {
    return res.status(500).json({
      error: "Failed to create lead",
      message: "Failed to create lead",
    });
  }
  const result = addNewLead(email);
  return res.status(200).json({
    result: id,
    message: "Hello from path!",
  });
});

app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

// 👇 Export with ESM-compatible syntax
export const handler = serverless(app);

