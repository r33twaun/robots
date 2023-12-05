const client = require('./client')
const { robotTasks } = require('./robotTasks')
const { robotOwners } = require('./robotOwners')

const dropTables = async () => {
    try {
        console.log('Dropping All Tables!')
        await client.query(`
        DROP TABLE IF EXISTS robots CASCADE;
        DROP TABLE IF EXISTS owners CASCADE;
        DROP TABLE IF EXISTS tasks CASCADE;
        DROP TABLE IF EXISTS robots_owners CASCADE;
        DROP TABLE IF EXISTS robots_tasks CASCADE;
        `)
    } catch (err) {
        throw err
    }
}

const createTables = async () => {
    try {
        console.log('Building All Tables!')
        await client.query(`
        CREATE TABLE robots (
            id SERIAL PRIMARY KEY,
            name VARCHAR(30) UNIQUE NOT NULL,
            model INT NOT NULL,
            company VARCHAR(30) NOT NULL,
            warranty_year BIGINT NOT NULL,
            child_safe BOOLEAN DEFAULT false,
            release_date DATE NOT NULL
        );
        CREATE TABLE owners (
            id SERIAL PRIMARY KEY,
            name VARCHAR(30) UNIQUE NOT NULL,
            email VARCHAR(30) NOT NULL
        );
        CREATE TABLE tasks (
            id SERIAL PRIMARY KEY,
            name VARCHAR(30) NOT NULL
        );
        CREATE TABLE robots_owners (
            robots_id INT REFERENCES robots(id),
            owners_id INT REFERENCES owners(id)
        );
        CREATE TABLE robots_tasks (
            robots_id INT REFERENCES robots(id),
            tasks_id INT REFERENCES tasks(id)
        );    
        `)
    } catch (err) {
        throw err
    }
}

const createInitialData = async () => {
    try {
        console.log('Created Initial Data!')
        await client.query(`
        INSERT INTO robots (name, model, company, warranty_year, 
            child_safe, release_date)
        VALUES
        ('Wing Zero', 01, 'Gundam', 2138, false, '1/13/1990'),
        ('Deathscythe Hell', 02, 'Gundam', 2136, true, '2/28/1991'),
        ('Heavyarms', 03, 'Gundam', 2133, true, '3/2/1993'),
        ('Sandrock', 04, 'Gundam', 2135, true, '6/21/1992'),
        ('Altron', 05, 'Gundam', 2134, false, '9/18/1994');

        INSERT INTO owners (name, email)
        VALUES 
        ('Antwaun', 'blast@aol.com'),
        ('Kellen', 'scythe@aol.com'),
        ('Levi', 'heavy@aol.com'),
        ('Alec', 'mohawk@aol.com'),
        ('Brennan', 'dragon@aol.com');
        
        INSERT INTO tasks (name)
        VALUES
        ('Meteor Destruction'),
        ('Tree cutting'),
        ('Fireworks'),
        ('Child protection'),
        ('Fire starter');
        `)
    } catch (err) {
        throw err
    }
}

const getRobotTasks = async () => {
    try {
        const { rows } = await client.query(`
SELECT robots.name AS robotsName, tasks.name AS tasksName
FROM robots
JOIN robots_tasks ON robots.id = robots_tasks.robots_id
JOIN tasks ON tasks.id = robots_tasks.tasks_id;
`)
        console.log(rows)
    } catch (err) {
        throw err
    }
}

const getRobotOwners = async () => {
    try {
        const { rows } = await client.query(`
        SELECT robots.name AS robotsName, owners.name AS ownersName
        FROM robots
        JOIN robots_owners ON robots.id = robots_owners.robots_id
        JOIN owners ON owners.id = robots_owners.owners_id;
        `)
        console.log(rows)
    } catch (err) {
        throw err
    }
}

const rebuildDB = async () => {
    try {
        client.connect()
        console.log(`CONNECTED TO THE DATABASE!!!`)
        await dropTables()
        await createTables()
        await createInitialData()
        await robotTasks(1, 1)
        await robotTasks(2, 2)
        await robotTasks(2, 4)
        await robotTasks(3, 3)
        await robotTasks(3, 4)
        await robotTasks(4, 2)
        await robotTasks(4, 4)
        await robotTasks(5, 3)
        await robotTasks(5, 5)
        await getRobotTasks()

        await robotOwners(1, 1)
        await robotOwners(2, 2)
        await robotOwners(2, 3)
        await robotOwners(3, 3)
        await robotOwners(4, 4)
        await robotOwners(5, 2)
        await robotOwners(5, 5)
        await getRobotOwners()

    } catch (err) {
        throw err
    }
}

module.exports = {
    rebuildDB
}