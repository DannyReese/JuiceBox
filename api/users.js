const express = require('express');
const usersRouter = express.Router();
const {getAllUser}= require('../db');


usersRouter.use((req,res,next)=>{
    console.log('A request is being made');
    // res.send({message:"hello from /users!"});
    next();
});


usersRouter.get('/', async(req,res)=>{
    const users = await getAllUser()
    console.log(users)
    res.send({
        users
    });
});

module.exports = usersRouter;

