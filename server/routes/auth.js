const express = require("express");
const router = express.Router();

const { getSession } = require("../config/db");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");


const Func = require("../models/function");

// Authenticate User
// Authenticate User
router.post("/login", async (req, res) => {
  const session = getSession();
  const result = await session.run(
    "MATCH (u:User {email: $email}) RETURN u",
    { email: req.body.email }
  );
  session.close();

  if (result.records.length === 0) {
    return res.status(400).json({
      message: "Email does not exist",
    });
  }

  const user = result.records[0].get("u").properties;

  const isValidPassword = await bcrypt.compare(req.body.password, user.password);
  if (!isValidPassword) {
    return res.status(400).json({
      message: "Invalid password",
    });
  }

  const token = jwt.sign(
    { id: user.id },
    process.env.PRIVATE_JWT,
    { expiresIn: "1h" }
  );

  res.status(200).json({ token: token, expiresIn: 3600 });
});

// New User
router.post("/sign-up", async (req, res) => {
  const session = getSession();

  const existingUserResult = await session.run(
    `MATCH (u:User {email: $email}) RETURN u`,
    { email: req.body.email }
  );

  if (existingUserResult.records.length > 0) {
    session.close();
    return res.status(400).json({
      message: "User with this email already exists",
    });
  }

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  
  // Generate a unique ID for the user
  const userId = uuidv4();


  const newUserResult = await session.run(
    `
    CREATE (u:User {id: $id, name: $name, email: $email, password: $password, regDate: $regDate})
    RETURN u { .name, .email }
    `,
    {
      id: userId,
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      regDate: new Date().toISOString(),
    }
  );

  const newUser = newUserResult.records[0].get("u").properties;

  if (req.body.functionName) {
    const functionResult = await Func.getByName(req.body.functionName);

    if (functionResult) {
      await session.run(
        `
        MATCH (u:User {email: $email}), (f:Function {name: $functionName})
        CREATE (u)-[:HAS_FUNCTION]->(f)
        `,
        {
          email: req.body.email,
          functionName: req.body.functionName,
        }
      );
    }
  }

  session.close();

  res.status(201).json({
    message: "User created",
    result: newUser,
  });
});

module.exports = router;
