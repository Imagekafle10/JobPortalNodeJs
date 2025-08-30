import express from "express";
import userAuth from "../middlewares/authMiddleware.js";
import { getUserController, updateUserController } from "../controllers/userController.js";

//router Object
const router = express.Router();

//Routes
//Get Users|| Get
router.post('/getUser', userAuth, getUserController)

//Update User ||Put
router.put('/update-user', userAuth, updateUserController)

export default router