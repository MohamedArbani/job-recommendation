const express = require("express");
const router = express.Router();

const { getSession } = require("../config/db");
const User = require('../models/user');
const Experience = require('../models/experience');


// Get Profile
router.get("/me", async (req, res) => {
  const session = getSession();
  const result = await session.run(
    "MATCH (u:User) WHERE ID(u) = $userId RETURN u { .name, .email }",
    { userId: req.body.user.id }
  );
  session.close();

  if (result.records.length === 0) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const user = result.records[0].get("u").properties;
  res.json(user);
});


// Get All Users
router.get("/", async (req, res) => {
  const session = getSession();
  const result = await session.run(
    "MATCH (u:User) RETURN u"
  );
  session.close();

  const users = result.records.map((record) => record.get("u").properties);
  res.json(users);
});


router.get("/:id", async (req, res) => {
  const session = getSession();
  const result = await session.run(
    "MATCH (u:User {id: $id}) RETURN u",
    { id: req.params.id }
  );
  const experiences = await getExperiencesByUser(req.params.id);
  const func = await getFunctionByUser(req.params.id);

  session.close();

  if (result.records.length === 0) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const user = result.records[0].get("u").properties;
  user.experiences = experiences;
  user.function = func;
  res.json(user);
});

// Get User's Experiences
router.get("/:userId/experiences", async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await session.run(
      "MATCH (u:User {id: $id}) RETURN u",
      { id: userId }
    );
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const experiences = await getExperiencesByUser(userId);
    res.status(200).json(experiences);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve user's experiences" });
  }
});

// Helper function to get experiences by user
async function getExperiencesByUser(userId) {
  const session = getSession();
  const result = await session.run(
    `
    MATCH (u:User)-[:HAS_EXPERIENCE]->(e:Experience)
    WHERE u.id = $id
    RETURN e
    `,
    { id: userId }
  );
  session.close();

  const experiences = result.records.map((record) => record.get("e").properties);
  return experiences;
}

const getFunctionByUser = async (userId) => {
  const session = getSession();
  const result = await session.run(
    `
    MATCH (u:User)-[:HAS_FUNCTION]->(f:Function)
    WHERE u.id = $userId
    RETURN f
    `,
    { userId }
  );
  session.close();

  const func = result.records.map((record) => record.get("f").properties);
  return func;
};


router.get("/search/:key", async (req, res) => {
  const session = getSession();
  const result = await session.run(
    "MATCH (u:User) WHERE u.email CONTAINS $key RETURN u { .name, .email }",
    { key: req.params.key }
  );
  session.close();

  const users = result.records.map((record) => record.get("u").properties);
  res.json(users);
});

/* Update User by Id with PUT and PATCH */

// update user by id (PUT)
router.put("/:id", async (req, res) => {
  const session = getSession();
  const result = await session.run(
    "MATCH (u:User) WHERE ID(u) = $userId SET u.name = $name, u.email = $email, u.password = $password, u.isAdmin = $isAdmin, u.regDate = $regDate RETURN u { .name, .email }",
    {
      userId: parseInt(req.params.id),
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      isAdmin: req.body.isAdmin,
      regDate: req.body.regDate,
    }
  );
  session.close();

  if (result.records.length === 0) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const user = result.records[0].get("u").properties;
  res.json(user);
});

// update user by id (PATCH)
router.patch("/:id", async (req, res) => {
  const session = getSession();
  const result = await session.run(
    "MATCH (u:User {id: $id}) SET u.gender = $gender, u.phone = $phone, u.address = $address  RETURN u",
    {
      id: req.params.id,
      gender: req.body.gender,
      phone: req.body.phone,
      address: req.body.address,
    }
  );
  session.close();

  if (result.records.length === 0) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  const user = result.records[0].get("u").properties;
  res.json(user);
});

/* *********************************************** */

// delete user by id
router.delete("/:id", async (req, res) => {
  const session = getSession();
  const result = await session.run(
    "MATCH (u:User) WHERE ID(u) = $userId DELETE u",
    { userId: parseInt(req.params.id) }
  );
  session.close();

  if (result.summary.counters.nodesDeleted() === 0) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  res.json({
    message: "User deleted successfully",
  });
});

// Delete User by Email
router.delete("/email/:email", async (req, res) => {
  const session = getSession();

  const email = req.params.email;

  const result = await session.run(
    "MATCH (u:User {email: $email})-[r]-() DELETE u, r",
    { email }
  );

  session.close();

  // const nodesDeleted = result.summary.counters.nodesDeleted || 0;

  // if (nodesDeleted === 0) {
  //   return res.status(404).json({
  //     message: "User not found",
  //   });
  // }

  res.status(200).json({
    message: "User and related nodes deleted successfully",
  });
});


module.exports = router;
