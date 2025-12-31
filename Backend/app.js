const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const express = require("express")
const app = express();
const connectToDb=require("./db/db");
connectToDb();
const userRoutes = require("./routes/user.routes");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRoutes);


module.exports = app;