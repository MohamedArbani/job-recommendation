const express = require("express");
const router = express.Router();

const Experience = require("../models/experience");

// Create Experience
router.post("/", async (req, res) => {
  const { name, fromDate, toDate } = req.body;
  try {
    const experience = await Experience.create(name, fromDate, toDate);
    res.status(201).json(experience);
  } catch (error) {
    res.status(500).json({ error: "Failed to create experience" });
  }
});

// Get Experience by Name
router.get("/:name", async (req, res) => {
  const name = req.params.name;
  try {
    const experience = await Experience.getByName(name);
    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }
    res.json(experience);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve experience" });
  }
});

// Assign Experience to User
router.post("/:userId/assign", async (req, res) => {
  const userId = req.params.userId;
  const idExperience = req.body.idExperience;
  try {
    const result = await Experience.assignExperienceToUser(userId, idExperience);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to assign experience to user" });
  }
});

module.exports = router;
