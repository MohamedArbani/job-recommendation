const { getSession } = require('../config/db');
const jwt = require('jsonwebtoken');

const userLabel = 'User';

const User = {
  create: async (name, email, password) => {
    const session = getSession();
    const result = await session.run(
      `CREATE (u:${userLabel} {name: $name, email: $email, password: $password, regDate: $regDate}) RETURN u`,
      { name, email, password, regDate: new Date().toISOString() }
    );
    session.close();
    return result.records[0].get('u').properties;
  },

  getByEmail: async (email) => {
    const session = getSession();
    const result = await session.run(
      `MATCH (u:${userLabel} {email: $email}) RETURN u`,
      { email }
    );
    session.close();
    if (result.records.length === 0) {
      return null;
    }
    return result.records[0].get('u').properties;
  },

  generateAuthToken: (user) => {
    const token = jwt.sign(
      { id: user._id },
      process.env.PRIVATE_JWT,
      { expiresIn: '1h' }
    );
    return token;
  }
};

module.exports = User;
