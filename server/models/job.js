const { getSession } = require('../config/db');
const { v4: uuidv4 } = require("uuid");

const jobLabel = 'Job';
const functionLabel = 'Function';

const Job = {
  createJob: async (name, imageUrl, company) => {
    const session = getSession();
    const jobId = uuidv4();
    const result = await session.run(
      `CREATE (j:${jobLabel} {id: $jobId, name: $name, imageUrl: $imageUrl, company: $company}) RETURN j`,
      { jobId, name, imageUrl, company }
    );
    session.close();
    return result.records[0].get('j').properties;
  },

  getAllJobs: async () => {
    const session = getSession();
    const result = await session.run(
      `MATCH (j:${jobLabel}) RETURN j`
    );
    session.close();
    return result.records.map(record => record.get('j').properties);
  },

  getJobById: async (jobId) => {
    const session = getSession();
    const result = await session.run(
      `MATCH (j:${jobLabel} {id: $jobId}) RETURN j`,
      { jobId }
    );
    session.close();
    if (result.records.length === 0) {
      return null;
    }
    return result.records[0].get('j').properties;
  },

  updateJob: async (jobId, name, imageUrl, company) => {
    const session = getSession();
    const result = await session.run(
      `
      MATCH (j:${jobLabel} {id: $jobId})
      SET j.name = $name, j.imageUrl = $imageUrl, j.company = $company
      RETURN j
      `,
      { jobId, name, imageUrl, company }
    );
    session.close();
    if (result.records.length === 0) {
      return null;
    }
    return result.records[0].get('j').properties;
  },

  deleteJob: async (jobId) => {
    const session = getSession();
    const result = await session.run(
      `
      MATCH (j:${jobLabel} {id: $jobId})
      DELETE j
      `,
      { jobId }
    );
    session.close();
    return result.summary.counters.nodesDeleted() > 0;
  },

  applyForJob: async (userId, jobId) => {
    const session = getSession();

    // Check if the user has the function "Recruté"
    const result = await session.run(
      `
      MATCH (u:User)-[:HAS_FUNCTION]->(f:${functionLabel} {name: "Recruté"})
      WHERE u.id = $userId
      RETURN u
      `,
      { userId }
    );

    if (result.records.length === 0) {
      session.close();
      throw new Error("User is not eligible to apply for the job");
    }

    // Create a relationship between the user and the job
    await session.run(
      `
      MATCH (u:User), (j:${jobLabel} {id: $jobId})
      WHERE u.id = $userId
      CREATE (u)-[:APPLIED_FOR]->(j)
      `,
      { userId, jobId }
    );

    session.close();
    return true;
  },
  getAppliedJobsByUser: async (userId) => {
    const session = getSession();
    const result = await session.run(
      `
      MATCH (u:User)-[:APPLIED_FOR]->(j:Job)
      WHERE u.id = $userId
      RETURN j
      `,
      { userId }
    );
    session.close();

    const appliedJobs = result.records.map((record) => record.get('j').properties);
    return appliedJobs;
  },
};

module.exports = Job;
