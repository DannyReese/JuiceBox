const { Client } = require('pg')

const client = new Client("postgres://localhost:5432/juicebox-dev");



const getAllUser = async () => {

    try {
        const { rows } = await client.query(`SELECT id, username FROM users;`);

        return rows;
    } catch (error) {
        console.error(error);
    }
};


async function getAllPosts() {
    try {
        const { rows } = await client.query(`SELECT * FROM posts;`);
        return rows;
    } catch (error) {
        console.error(error)
    }
};


async function getPostsByUser(userId) {
    try {
        const { rows } = await client.query(`
            SELECT * FROM posts 
            WHERE "authorId"=${userId};`)
        return rows;

    } catch (error) {
        console.error(error)
    }
};


async function createUser({
    username,
    password,
    name,
    location
}) {
    try {
        const { rows } = await client.query(`
        INSERT INTO users (username, password,name,location)
        VALUES($1,$2,$3,$4)
        ON CONFLICT (username) DO NOTHING 
        RETURNING *;
       `, [username, password, name, location]);
        return rows
    } catch (error) {
        console.error("couldn't create this user")
        throw error
    }
};

async function createPost({
    authorId,
    title,
    content
}) {
    try {
        const result = await client.query(`
        INSERT INTO posts("authorId",title,content)
        VALUES($1,$2,$3)
        RETURNING *;`, [authorId, title, content])
        return result.rows
    } catch (error) {
        console.error("couldn't create post")
        throw error;
    }
};

async function updateUser(id, fields = {}) {
    const setString = Object.keys(fields).map((key, index) => `"${key}"=$${index + 1}`).join(', ')
    if (setString.length === 0) {
        return;
    }
    try {
        const { rows: [user] } = await client.query(`  
        UPDATE users
        SET ${setString}
        WHERE id=${id}
        RETURNING *;`, Object.values(fields));

        return user;
    } catch (error) {
        console.error(error);
        throw error;
    }
};


async function updatePost(id, fields = {}) {
    const setString = Object.keys(fields).map((key, index) =>`"${key}"=$${index + 1}`).join(', ')
    if (setString.length === 0) {
        return
    }
    try {
        const { rows: [post] } = await client.query(`
        UPDATE posts
        SET ${setString}
        WHERE id=${id}
        RETURNING *;`, Object.values(fields));
        return post
    } catch (error) {
        console.error('idk')
        throw error
    }
};

async function getUserById(userId){
    try{
    const {rows :[user]} = await client.query(`
    SELECT id,username,name,location,active 
    FROM users
    WHERE id=${userId};`);
    if(user.length===0){
        return null;
    }

user.post = await getPostsByUser(userId)

return user;

}catch(error){
    console.error(error);
    throw error
}
}


module.exports = {
    client,
    getAllUser,
    getAllPosts,
    createUser,
    updateUser,
    createPost,
    updatePost,
    getPostsByUser,
    getUserById
};