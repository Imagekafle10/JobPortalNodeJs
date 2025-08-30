import express from 'express';
import { loginController, registerController } from '../controllers/authController.js';

import rateLimit from 'express-rate-limit';


//ip limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

//router Obj
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     UserModel:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - location
 *       properties:
 *         id:
 *          type: string
 *          description: The Auto-generated id of user collection
 *          example : 1
 *         name:
 *           type: string
 *           description: User Name
 *         email:
 *           type: string
 *           description: User Email Address
 *         password:
 *           type: string
 *           description: User Password
 *         location:
 *           type: string
 *           description: User Location (city or country)
 *       example:
 *         id: "1"
 *         name: "John"
 *         email: "johndoe@gmail.com"
 *         password: "test@123"
 *         location: "Biratnagar"
 */

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication apis
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *    post:
 *      summary: register new user
 *      tags: [Auth]
 *      requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserModel'
 *      responses:
 *        200:
 *          description: user created successfully
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/UserModel'
 *        500:
 *          description: internal serevr error
 */



//routes
//Register Post
router.post('/register', limiter, registerController)


/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login page
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserModel'
 *     responses:
 *       200:
 *         description: Login Successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserModel'
 *       500:
 *         description: Something Went Wrong
 */


//Login Post
router.post('/login', limiter, loginController)

export default router;