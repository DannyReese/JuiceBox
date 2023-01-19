require('dotenv').config();
const express = require("express")
const PORT = 3000
const server = express()
const {client} = require('./db')
const morgan = require('morgan');
const apiRouter = require('./api');

client.connect();



server.use(morgan('dev'));

server.use(express.json());

server.use((req,res,next)=>{
    console.log('--Body Logger START--');
    console.log(req.body);
    console.log('--body Logger END--');
    next()
});

server.use('/api', apiRouter);



server.listen(PORT,()=>{
    console.log(`listening on ${PORT}`);
})
