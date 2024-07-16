const express = require("express");
const dotenv = require("dotenv").config();
const connectDB = require("./config/dbConnection");

const app = express();
const port = process.env.PORT || 5000;


connectDB();
app.use(express.json());

app.get("/" , (req, res) => {
    res.sendFile()
});

app.get("/user" , (req, res) => {
    res.send("This is a test for USER page");
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});