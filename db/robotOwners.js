const client = require('./client')

const robotOwners = async (robotsId, ownersId) => {
try {
const {rows: [roboOwner]} = await client.query(`
INSERT INTO robots_owners (robots_id, owners_id)
VALUES (${robotsId}, ${ownersId})
RETURNING *;
`)
return roboOwner
} catch(err) {
    throw err
}
}

module.exports = {
    robotOwners
}