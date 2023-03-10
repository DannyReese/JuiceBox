const {
    client,
    getAllTags,
    getAllUser,
    getAllPosts,
    createUser,
    updateUser,
    createPost,
    updatePost,
    getUserById,
    createTag,
    addTagsToPost,
    getPostsByTagName
} = require('./index');


async function dropTables() {
    try {

        console.log('starting to drop tables...')

        await client.query(`
            DROP TABLE IF EXISTS post_tags;
            DROP TABLE IF EXISTS tags;
            DROP TABLE IF EXISTS posts;
            DROP TABLE IF EXISTS users;
            `);
        console.log('table dropped');

    } catch (error) {
        console.error("Error dropping TABLES");
        throw error;
    }
};

async function makeTable() {
    try {
        console.log("starting to build tables...");

    await client.query(`
        CREATE TABLE users(
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        active BOOLEAN DEFAULT true
    );`);

    await client.query(`
        CREATE TABLE posts(
        id SERIAL PRIMARY KEY,
        "authorId" INTEGER REFERENCES users(id) NOT NULL,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        active BOOLEAN DEFAULT true

    );`);

    await client.query(`
        CREATE TABLE tags(
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL
    );`);

    await client.query(`
        CREATE TABLE post_tags(
        "postId" INTEGER REFERENCES posts(id),
        "tagId" INTEGER REFERENCES tags(id),
        UNIQUE("postId","tagId") 
    );`)

    console.log('table created!');

    } catch (error) {
        console.error("error building tables")
        throw error;
    }
};

async function createInitinalUser() {
    try {
        console.log('beginning to create user...');
        await createUser({ 
            username: 'irma22',
            password: 'baby',
            name: 'irma', 
            location: 'New York'
        });
        await createUser({ 
            username: 'sandra',
            password: 'sandygal',
            name: 'sandy',
            location: 'Hawaii' 
        });
        await createUser({
            username: 'jimmy',
            password: 'bush',
            name: 'billy', 
            location: 'Texas' 
        });
        console.log('users created')
    } catch (error) {
        console.error('could not creat user sorry');
        throw error
    }
}



async function createInitinalPosts() {
    try {
        const [billy,sandy,irma] = await getAllUser();


        console.log("Starting to create posts...");
        await createPost({
            authorId: billy.id,
            title: "First Post",
            content: "This is my first post. I hope I love writing blogs as much as I love writing them.",
            tags: ["#happy", "#youcandoanything"]
        });

        await createPost({
            authorId: sandy.id,
            title: "How does this work?",
            content: "Seriously, does this even do anything?",
            tags: ["#happy", "#worst-day-ever"]
        });

        await createPost({
            authorId: irma.id,
            title: "Living the Glam Life",
            content: "Do you even? I swear that half of you are posing.",
            tags: ["#happy", "#youcandoanything", "#canmandoeverything"]
        });
        console.log("Finished creating posts!");
    } catch (error) {
        console.log("Error creating posts!");
        throw error;
    }
}


async function createInitialTags() {
    try {
        console.log("Starting to create tags...");

        const [happy, sad, inspo, catman] = await createTag([
            '#happy',
            '#worst-day-ever',
            '#youcandoanything',
            '#catmandoeverything'
        ]);

        const [postOne, postTwo, postThree] = await getAllPosts();
        await addTagsToPost(postOne.id, [happy, inspo]);
        await addTagsToPost(postTwo.id, [sad, inspo]);
        await addTagsToPost(postThree.id, [happy, catman, inspo]);

        console.log("Finished creating tags!");
    } catch (error) {
        console.log("Error creating tags!");
        throw error;
    }
}






async function rebuildDb() {
    try {
        client.connect();


        await dropTables();
        await makeTable();
        await createInitinalUser();
        await createInitinalPosts();
        await createInitialTags();

    } catch (error) {
        throw error;
    }
}


async function testDB() {
    try {
        console.log("Starting to test database...");

        console.log("Calling getAllUsers");
        const users = await getAllUser();
        console.log("Result:", users);

        console.log("Calling updateUser on users[0]");

        const updateUserResult = await updateUser(users[0].id, {
            name: "Newname Sogood",
            location: "Lesterville, KY"
        });
        console.log("Result:", updateUserResult);

        console.log("Calling getAllPosts");
        const posts = await getAllPosts();
        console.log("Result:", posts);

        console.log("Calling updatePost on posts[0]");
        const updatePostResult = await updatePost(posts[0].id, {
          title: "New Title",
          content: "Updated Content"
        });
        console.log("Result:", updatePostResult);

        console.log("Calling updatePost on posts[1], only updating tags");
        const updatePostTagsResult = await updatePost(posts[1].id, {
            tags: ["#youcandoanything", "#redfish", "#bluefish"]
        });
        console.log("Result:", updatePostTagsResult);

        console.log("Calling getUserById with 1");
        const billy = await getUserById(1);
        console.log("Result:", billy);

        console.log("Calling getAllTags");
        const allTags = await getAllTags();
        console.log("Result:", allTags);

        console.log("Calling getPostsByTagName with #happy");
        const postsWithHappy = await getPostsByTagName("#happy");
        console.log("Result:", postsWithHappy);

        console.log("Finished database tests!");
    } catch (error) {
        console.log("Error during testDB");
        throw error;
    }
};




rebuildDb()
    .then(testDB)
    .catch(console.error)
    .finally(() => client.end())

