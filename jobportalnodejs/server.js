// const express = require('express');
//Api Documentation
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';


// type:module
import express from 'express';

import dotenv from 'dotenv';
import colors from 'colors';
import cors from 'cors';
import morgan from 'morgan';
import getConn from './config/db.js';
//Security Packages
import helmet from 'helmet';
//Routes Import
import testRoutes from './routes/testRoutes.js'
import authRoutes from './routes/authRoutes.js'
import errorMiddleware from './middlewares/errorMiddleware.js';
import userRoutes from './routes/userRouter.js'
import jobRoutes from './routes/jobsRoutes.js'

//.Env config
dotenv.config();

//Sql Connection
getConn();

//Swagger Api Config
const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Job Portal Application",
            version: "1.0.0",       // recommended
            description: "Node Expressjs Job Portal Application",
        },
        servers: [
            { url: "http://localhost:8000" }
        ],
    },
    apis: ["./routes/*.js"],
};

const spec = swaggerJSDoc(options);

//Rest object
const app = express();


//middlewares
app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));



//Routes
app.use('/api/v1/test', testRoutes)
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/user', userRoutes)
app.use('/api/v1/job', jobRoutes)


//HomeRoute
app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(spec));



//validation MiddleWare
app.use(errorMiddleware);

//Port 
const Port = process.env.PORT || 8000;
//listen
app.listen(Port, () => {
    console.log(`Server Started in ${process.env.DEV_MODE} at ${Port}`.bgCyan.white);

})