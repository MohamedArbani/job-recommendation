const { getSession } = require('../config/db');

const experienceLabel = 'Experience';
const { v4: uuidv4 } = require("uuid");


const Experience = {
  create: async (name, fromDate, toDate) => {
    const session = getSession();
    const result = await session.run(
      `CREATE (e:${experienceLabel} {id:$id, name: $name, fromDate : $fromDate, toDate : $toDate}) RETURN e`,
      {id: uuidv4() , name, fromDate, toDate}
    );
    session.close();
    return result.records[0].get('e').properties;
  },

  getByName: async (name) => {
    const session = getSession();
    const result = await session.run(
      `MATCH (e:${experienceLabel} {name: $name}) RETURN e`,
      { name }
    );
    session.close();
    if (result.records.length === 0) {
      return null;
    }
    return result.records[0].get('e').properties;
  },
  assignExperienceToUser: async (userId, idExperience) => {
    const session = getSession();
    console.log('userId, idExperience :>> ', userId, idExperience);
    const result = await session.run(
      `
      MATCH (u:User), (e:${experienceLabel} {id: $idExperience})
      WHERE u.id = $userId
      CREATE (u)-[:HAS_EXPERIENCE]->(e)
      `,
      {idExperience,  userId }
    );
    session.close();
    return result;
  },

};

module.exports = Experience;
