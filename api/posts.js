const express = require('express');
const postsRouter = express.Router();
const { getAllPosts} = require('../db');

postsRouter.use((req,res,next)=>{
    console.log('sending a little something from posts');
    next()
});

postsRouter.get('/',async(req,res)=>{
    const posts = await getAllPosts()
    console.log(posts)
    res.send(
        {posts}
        );
});

module.exports = postsRouter;