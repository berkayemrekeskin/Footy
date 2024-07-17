/*
  auth:
    register
    login
  profile:
    profile?:id (self || other)
  main:
    dashboard
    friends (later)
*/

const express = require("express");
const dotenv = require("dotenv").config();
const connectDB = require("./config/dbConnection");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

connectDB();
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
}));
app.use(express.json());
app.use("/api/auth", require("./routes/auth"));
app.use("/api/info", require("./routes/info"));
app.use("/api/training", require("./routes/training"));

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});