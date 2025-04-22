import serverless from "serverless-http";
import express from "express";
import { createClient } from "redis";
import cors from 'cors'


import { addNewLead, getLeads } from "./db/crud.mjs";
import { validateLeeds } from "./validator/validateLeeds.mjs";
import { userRouter } from './user/routes.mjs'
import { dbClient } from "./db/clients.mjs";
import { swaggerUi, swaggerSpec } from './swagger.mjs';

import path from 'path';
import { fileURLToPath } from 'url';

// Required to make __dirname work in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();

// Serve Swagger UI at /api-docs
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use('/api-docs', swaggerUi.serve);

// app.get('/api-docs', swaggerUi.setup(swaggerSpec));

// With this:
app.get('/api-docs', swaggerUi.setup(swaggerSpec, {
  customCssUrl: '/swagger-ui/swagger-ui.css',
  customJs: '/swagger-ui/swagger-ui-bundle.js',
}));


app.use(express.json());
app.use('/user', userRouter);


const redisClient = createClient();

redisClient.on("error", (err) => console.error("Redis error:", err));

const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};



const corsOptions = {
  origin: 'https://my-frontend-domain.com', // or use an array
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// Middleware to catch invalid JSON syntax
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ error: "Invalid JSON format" });
  }
  next();
});

const STAGE = process.env.STAGE || 'deployment';

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


/**
 * @openapi
 * /leeds:
 *   get:
 *     summary: Get all leads
 *     responses:
 *       200:
 *         description: List of leads
 */
app.get("/leeds", async (req, res, next) => {
  const leads = await getLeads();
  return res.status(200).json({
    result : leads,
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


// Serve static files if needed
app.use('/swagger-ui', express.static(path.join(__dirname, 'node_modules/swagger-ui-dist')));


app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});

// 👇 Export with ESM-compatible syntax
const handler = serverless(app);

export { redisClient, connectRedis, handler };

