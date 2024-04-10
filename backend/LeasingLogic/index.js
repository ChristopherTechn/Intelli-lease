const express = require("express");
const logicRoutes = require("./src/routers/LogicRoutes");
const sql = require("mssql");
const config = require("../LeasingLogic/src/config/userConfig");
require("dotenv").config();

const cors = require("cors");

const app = express();
app.use(express.json());
const corsOptions = {
  origin: "https://intelli-lease-land-details.onrender.com",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors());

async function startApp() {
  try {
    const pool = await sql.connect(config);
    console.log("App Connected to database");

    app.use((req, res, next) => {
      req.pool = pool;
      next();
    });

    app.use("/", logicRoutes);

    app.get("/", (req, res) => {
      res.send("IntelliLease");
    });

    const port = process.env.PORT || 8080;
    app.listen(port, () => {
      console.log(`Server is listening at port ${port}`);
    });
  } catch (error) {
    console.log("Error connecting to database");
    console.log(error);
  }
}

startApp();
