const express = require('express');
const usersRouter = express.Router();
const { getAllUser, getUserByUsername, createUser,getUserById, updateUser } = require('../db');
const {requireUser} = require('./utils')

usersRouter.use((req, res, next) => {
    console.log('A USER request is being made');

    next();
});


usersRouter.get('/', async (req, res) => {
    const users = await getAllUser()
    console.log(users)
    res.send({
        users
    });
});


usersRouter.post('/login', async (req, res, next) => {
    const { username, password} = req.body;
    if (!username || !password){
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
            id:user.id,
            username,
        },process.env.JWT_SECRET,{
            expiresIn: '1w'
        });
        res.send({
            message:'Thank Yout For Signing Up!',
            token
        });
    }catch({name,message}){
      
        next([name,message]);
    }
})

usersRouter.delete('/:userId', requireUser, async (req, res, next) => {
    try {
      const { userId } = req.params
      const user = await getUserById(userId)
  
      if (user && user.id === req.user.id) {
        const updatedUser = await updateUser(user.id, { active: false });
        res.send({ userInactive: updatedUser });
      } else {
        next(user ? {
          name: "UnauthorizedUserError",
          message: "You cannot deactivate an account that is not yours"
        } : {
          name: "UserNotFoundError",
          message: "That User does not exist"
        })
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  });
  


module.exports = usersRouter;

