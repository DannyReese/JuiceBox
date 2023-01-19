const express = require('express');
const usersRouter = express.Router();
const { getAllUser, getUserByUsername } = require('../db');


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


module.exports = usersRouter;

