const client = require('./client')

const robotTasks = async (robotsId, tasksId) => {
try {
const {rows: [roboTask]} = await client.query(`
INSERT INTO robots_tasks (robots_id, tasks_id)
VALUES (${robotsId}, ${tasksId})
RETURNING *;
`)
return roboTask
} catch(err) {
    throw err
}
}

module.exports = {
    robotTasks
}