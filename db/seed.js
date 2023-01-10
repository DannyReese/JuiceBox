const {
    client,
    getAllUser,
    createUser
} = require('./index');

async function createInitinalUser(){
try{
    console.log('beginning to create user...');
     const irma = await createUser({username:'imra',password:'baby'});
     const sandra = await createUser({ username: 'sandra',password: 'sandygal' });
     const jimmy = await createUser({username:'jimmy',password:'bush'});
     const result = [irma,sandra,jimmy]
    console.log("results",result)
    console.log('users created')
}catch(error){
    console.error('could not make irma');
    throw error
}
}

async function dropTables() {
    try {
        console.log('starting to drop tables...')

        await client.query(`DROP TABLE IF EXISTS users`);

        console.log('table dropped');

    } catch (error) {
        console.error("Error dropping tABLES");
        throw error;
    }
};

async function makeTable() {
    try {
        console.log("starting to build tables...");

        await client.query(`CREATE TABLE users(
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL
        );`);

        console.log('table created');

    } catch (error) {
        console.error("error building tables")
        throw error;
    }
};

async function rebuildDb() {
    try {
        client.connect();


        await dropTables();
        await makeTable();
        await createInitinalUser();
    } catch (error) {
        throw error;
    }
}

async function testDB() {
    try {
        console.log('starting to test database..')

        const users = await getAllUser();

        console.log("getAllUser:", users);

        console.log('DB test complete!');

    } catch (error) {
        console.error("error getting database");
        throw error;
    }
}




rebuildDb()
    .then(testDB)
    .catch(console.error)
    .finally(() => client.end())

