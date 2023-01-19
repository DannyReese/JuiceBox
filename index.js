const express = require("express")
const PORT = 3000
const server = express()

server.use((req,res,next)=>{
    console.log('--Body Logger START--');
    console.log(req.body);
    console.log('--body Logger END--');
    next()
});

// server.use('/api', (req, res, next) => {
//     console.log(req ,"A request was made to /api");
//     next();
//   });
  
//   server.get('/api', (req, res, next) => {
//     console.log("A get request was made to /api");
//     res.send({ message: "success" });
//   });

server.listen(PORT,()=>{
    console.log(`listening on ${PORT}`);
})
