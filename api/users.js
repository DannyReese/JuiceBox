const express = require('express');
const usersRouter = express.Router();
const { getAllUser, getUserByUsername, createUser } = require('../db');


usersRouter.use((req, res, next) => {
    console.log('A USER request is being made');

    next();
});


usersRouter.get('/', async (req, res) => {
    const users = await getAllUser()
    res.send({
        users
    });
});


usersRouter.post('/login', async (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
        next({
            name: "MissingCredentialsError",
            message: "Please supply both username and password"
        });

    }
    try {
        const user = await getUserByUsername(username);
        console.log(user)
        if (user && user.password == password) {
            const jwt = require('jsonwebtoken')
            const token = jwt.sign({id:user.id,username:user.username},process.env.JWT_SECRET)
            res.send({ message: "you're logged in!",token:token});

        } else {
            next({
                name: "IncorrectCredentialsError",
                message: 'Username or Password is incorrect'
            });
        }
    } catch (error) {
        console.log(error)
        next(error);
    }

});

usersRouter.post('/register',async(req,res,next)=>{
    const {username,password,name,location} = req.body;

    try{
        const _user = await getUserByUsername(username);
        if(_user){
            next({
                name:'UserExistsError',
                message:'This username already exists'
        });
        }
        const user = await createUser({
            username,
            password,
            name,
            location,});
            
        const jwt = require('jsonwebtoken')
        const token = jwt.sign({
            id: user.id,
            username,
        },process.env.JWT_SECRET,{
            expiresIn: '1w'
        });
        res.send({
            message:'Thank Yout For Signing Up!',
            token
        });
    }catch({name,message}){
        console.log({name,message})
        next([name,message]);
    }
})


module.exports = usersRouter;

