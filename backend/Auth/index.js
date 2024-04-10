/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *   schemas:
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *     Success:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         result:
 *           type: object
 */

/**
 * @swagger
 * tags:
 *   name: JifunzeHub
 *   description: https://jifunze-hub.onrender.com
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: Welcome message
 *     tags: [JifunzeHub]
 *     responses:
 *       200:
 *         description: Welcome message
 */

/**
 * @swagger
 * /api-docs:
 *   get:
 *     summary: Swagger UI documentation
 *     tags: [JifunzeHub]
 *     responses:
 *       200:
 *         description: Swagger UI documentation page
 */

/**
 * @swagger
 * /protected:
 *   get:
 *     summary: Protected route
 *     description: Displays a message for authenticated users
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully authenticated
 *       401:
 *         description: Authentication failed
 */

require("dotenv").config();
const cors = require("cors");
const express = require("express");
const sql = require("mssql");
const config = require("./src/config/userConfig");
const userRoutes = require("../Auth/src/routers/userRoutes");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const ejs = require("ejs");

async function start(){
  try {
  
    const pool =  await sql.connect(config);
  
    if (pool){
     startApp(pool);  
    }
  
  }catch(e){
    console.log(e)
  }
  
}

async function startApp(pool) {

  const app = express();
 
  try {
    app.set("view engine", "ejs");
    const options = {
      definition: {
        openapi: "3.0.0",
        info: {
          title: "IntelliLease API Documentation",
          version: "1.0.0",
          description: "Documentation for Jifunze Hub API",
        },
      },
      apis: ["./src/routers/*.js"],
    };
    const specs = swaggerJsdoc(options);

    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
    app.use(express.json());
    app.use(
      cors()
    );

    app.set("trust proxy", 1);

    app.get("/", (req, res) => {
      res.send("Intelli Lease");
    });

    app.use('/', userRoutes);

    app.get("/protected", (req, res) => {
      res.send("Hello!");
    });

    console.log('user', process.env.DB_USER);

    const port = process.env.PORT || 8080;
    app.listen(port, () => {
      console.log(`Server is listening at port ${port}`);
    });
  } catch (error) {
    console.log("Error connecting to database");
    console.log(error);
  }
}

start();