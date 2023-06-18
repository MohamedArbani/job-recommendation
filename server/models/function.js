const { getSession } = require('../config/db');

const funcLabel = 'Function';

const Func = {
  create: async (name) => {
    const session = getSession();
    const result = await session.run(
      `CREATE (f:${funcLabel} {name: $name}) RETURN f`,
      { name}
    );
    session.close();
    return result.records[0].get('f').properties;
  },

  getByName: async (name) => {
    const session = getSession();
    const result = await session.run(
      `MATCH (f:${funcLabel} {name: $name}) RETURN f`,
      { name }
    );
    session.close();
    if (result.records.length === 0) {
      return null;
    }
    return result.records[0].get('f').properties;
  },
  assignFunctionToUser: async (userId, functionName) => {
    const session = getSession();
    const result = await session.run(
      `
      MATCH (u:User), (f:${funcLabel} {name: $functionName})
      WHERE ID(u) = $userId
      CREATE (u)-[:HAS_FUNCTION]->(f)
      `,
      { userId, functionName }
    );
    session.close();
    return result;
  },

};

module.exports = Func;
