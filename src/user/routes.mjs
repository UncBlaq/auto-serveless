import { Router } from "express";

import { loginUserSchema, userSchema } from "./schemas.mjs";
import { validateWithZod } from "../validator/validateLeeds.mjs";
import { checkExistingEmail } from "./utils.mjs";
import { createUser } from "./userControler.mjs";

// ./user/routes.mjs
export const userRouter = Router();


/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     description: Register a new user and return a JWT token
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: securepassword
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User created successfully
 *                 token:
 *                   type: string
 *       400:
 *         description: Bad request
 */


userRouter.post(
    "/api/users",
    validateWithZod(userSchema),
    checkExistingEmail,
    createUser
  );


export default userRouter;