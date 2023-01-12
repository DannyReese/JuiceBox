const {
    client,
    getAllUser,
    createUser,
    updateUser,

} = require('./index');

async function createInitinalUser() {
    try {
        console.log('beginning to create user...');
        const irma = await createUser({ username: 'irma22', password: 'baby', name: 'irma', location: 'New York' });
        const sandra = await createUser({ username: 'sandra', password: 'sandygal', name: 'sandy', location: 'Hawaii' });
        const jimmy = await createUser({ username: 'jimmy', password: 'bush', name: 'billy', location: 'Texas' });
        const result = [irma, sandra, jimmy]
        console.log("results", result)
        console.log('users created')
    } catch (error) {
        console.error('could not creat user sorry');
        throw error
    }
}

async function dropTables() {
    try {
        console.log('starting to drop tables...')

        await client.query(`DROP TABLE IF EXISTS posts`);
        await client.query(`DROP TABLE IF EXISTS users`);



        console.log('table dropped');

    } catch (error) {
        console.error("Error dropping tABLES");
        throw error;
    }
};
async function makePostTabel() {
    try {
        console.log('beginning to build post table...')

        await client.query(`CREATE TABLE posts(
            id SERIAL PRIMARY KEY,
            "authorId" INTEGER REFERENCES users(id) NOT NULL,
            title VARCHAR(255) NOT NULL,
            content TEXT NOT NULL,
            active BOOLEAN DEFAULT true

        );`);
        console.log('post table created!')
    } catch (error) {
        console.error('couldnt create post table');
        throw error;
    }
}


async function makeTable() {
    try {
        console.log("starting to build tables...");

        await client.query(`CREATE TABLE users(
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            name VARCHAR(255) NOT NULL,
            location VARCHAR(255) NOT NULL,
            active BOOLEAN DEFAULT true

        );`);

        console.log('table created!');

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
        await makePostTabel()
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
        console.log('begin update...')
        const updateUserResult = await updateUser(users[0].id, {
            name: 'Danny',
            location: 'Long Island'
        })
        console.log('updateUser', updateUserResult)

        console.log('finished update!');

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

