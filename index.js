const express = require("express")
const PORT = 3000
const server = express()

server.use((req,res,next)=>{
    console.log('--Body Logger START--');
    console.log(req.body);
    console.log('--body Logger END--');
    next()
})


server.listen(PORT,()=>{
    console.log(`listening on ${PORT}`);
})
