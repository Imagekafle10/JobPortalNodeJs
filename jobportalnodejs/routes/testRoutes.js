import express from 'express';
import { testPostController } from '../controllers/testController.js';
import userAuth from '../middlewares/authMiddleware.js';

//router Obj
const router = express.Router();

//routes
router.post('/test-post', testPostController)

export default router