const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const dataPath = path.join(__dirname, "..", "data", "items.json");

router.post("/", (req, res) => {
  const { key, operator, value } = req.body;

  const items = JSON.parse(fs.readFileSync(dataPath));

  let filtered = [];

  if (operator === ">") {
    filtered = items.filter((item) => item[key] > value);
  } else if (operator === "<") {
    filtered = items.filter((item) => item[key] < value);
  } else if (operator === "=") {
    filtered = items.filter((item) => item[key] === value);
  } else if (operator === "contains") {
    filtered = items.filter((item) => {
      const prop = item[key];
      return (
        typeof prop === "string" &&
        prop.toLowerCase().includes(value.toLowerCase())
      );
    });
  } else {
    return res.status(400).json({ message: "Invalid operator" });
  }

  res.json(filtered);
});

module.exports = router;
