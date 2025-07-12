// const express = require("express");
import express from "express";
// const fs = require("fs");
import fs from "fs";
// const cors = require("cors");
import cors from "cors";
const app = express();
const PORT = 5001;

const WORKFLOW_FILE = "./workflow.json";

app.use(cors());
app.use(express.json());

// Get workflow
app.get("/api/workflow", (req, res) => {
  const data = fs.readFileSync(WORKFLOW_FILE, "utf8");
  res.json(JSON.parse(data));
});

// Save workflow
app.post("/api/workflow", (req, res) => {
  const data = req.body;
  fs.writeFileSync(WORKFLOW_FILE, JSON.stringify(data, null, 2));
  res.json({ message: "Saved successfully" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
