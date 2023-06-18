const express = require("express");
const router = express.Router();

const { getSession } = require("../config/db");

const funcLabel = "Function";

// Create Function
router.post("/", async (req, res) => {
  const session = getSession();
  const result = await session.run(
    `CREATE (f:${funcLabel} {name: $name}) RETURN f`,
    { name: req.body.name }
  );
  session.close();
  const createdFunc = result.records[0].get("f").properties;
  res.status(201).json(createdFunc);
});

// Get All Functions
router.get("/", async (req, res) => {
  const session = getSession();
  const result = await session.run(`MATCH (f:${funcLabel}) RETURN f`);
  session.close();
  const functions = result.records.map((record) => record.get("f").properties);
  res.json(functions);
});

// Get Function by ID
router.get("/:id", async (req, res) => {
  const session = getSession();
  const result = await session.run(
    `MATCH (f:${funcLabel}) WHERE ID(f) = toInteger($id) RETURN f`,
    { id: req.params.id }
  );
  session.close();
  if (result.records.length === 0) {
    return res.status(404).json({ message: "Function not found" });
  }
  const func = result.records[0].get("f").properties;
  res.json(func);
});

// Update Function
router.put("/:id", async (req, res) => {
  const session = getSession();
  const result = await session.run(
    `
    MATCH (f:${funcLabel}) WHERE ID(f) = toInteger($id)
    SET f.name = $name
    RETURN f
    `,
    { id: req.params.id, name: req.body.name }
  );
  session.close();
  if (result.records.length === 0) {
    return res.status(404).json({ message: "Function not found" });
  }
  const updatedFunc = result.records[0].get("f").properties;
  res.json(updatedFunc);
});

// Delete Function
router.delete("/:id", async (req, res) => {
  const session = getSession();
  const result = await session.run(
    `
    MATCH (f:${funcLabel}) WHERE ID(f) = $id
    DELETE f
    RETURN COUNT(f) AS count
    `,
    { id: req.params.id }
  );
  session.close();
  const count = result.records[0].get("count").toNumber();
  if (count === 0) {
    return res.status(404).json({ message: "Function not found" });
  }
  res.json({ message: "Function deleted" });
});

module.exports = router;
