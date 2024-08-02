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

const {positions} = require("./constansts");
const {physicalTraining, technicalTraining, tacticalTraining} = require("./constansts");

app.get('/api/positions', (req, res) => {
  res.json({positions});
});

app.get('/api/physicalTraining', (req, res) => {
  res.json({physicalTraining});
});

app.get('/api/technicalTraining', (req, res) => {
  res.json({technicalTraining});
});

app.get('/api/tacticalTraining', (req, res) => {
  res.json({tacticalTraining});
});

app.use("/api/auth", require("./routes/auth"));
app.use("/api/info", require("./routes/info"));
app.use("/api/training", require("./routes/training"));
app.use("/api/match", require("./routes/match"));

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});