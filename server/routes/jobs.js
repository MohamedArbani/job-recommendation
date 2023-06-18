const express = require("express");
const router = express.Router();

const Job = require("../models/job");

// Create Job
router.post("/", async (req, res) => {
  const { name, imageUrl, company } = req.body;

  try {
    const job = await Job.createJob(name, imageUrl, company);
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ error: "Failed to create job" });
  }
});

// Get All Jobs
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.getAllJobs();
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ error: "Failed to get jobs" });
  }
});

// Get Job by ID
router.get("/:id", async (req, res) => {
  const jobId = req.params.id;

  try {
    const job = await Job.getJobById(jobId);
    if (!job) {
      res.status(404).json({ message: "Job not found" });
    } else {
      res.status(200).json(job);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to get job" });
  }
});

// Update Job
router.put("/:id", async (req, res) => {
  const jobId = req.params.id;
  const { name, imageUrl, company } = req.body;

  try {
    const updatedJob = await Job.updateJob(jobId, name, imageUrl, company);
    if (!updatedJob) {
      res.status(404).json({ message: "Job not found" });
    } else {
      res.status(200).json(updatedJob);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update job" });
  }
});

// Delete Job
router.delete("/:id", async (req, res) => {
  const jobId = req.params.id;

  try {
    const deletedJob = await Job.deleteJob(jobId);
    if (!deletedJob) {
      res.status(404).json({ message: "Job not found" });
    } else {
      res.status(200).json({ message: "Job deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete job" });
  }
});

// Apply for a Job
router.post("/:id/apply", async (req, res) => {
    const userId = req.body.userId;
    const jobId = req.params.id;
  
    try {
      await Job.applyForJob(userId, jobId);
      res.status(200).json({ message: "Job application successful" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  // Get Applied Jobs by User
router.get("/user/:userId/applied-jobs", async (req, res) => {
    const userId = req.params.userId;
    const appliedJobs = await Job.getAppliedJobsByUser(userId);
    res.send(appliedJobs);
  });

module.exports = router;
