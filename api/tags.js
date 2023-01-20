const express = require('express');
const tagsRouter = express.Router();
const {getAllTags} = require('../db')

tagsRouter.use((req,res,next)=>{
    console.log('sending a little somthing from TAGS');

    next()
});

tagsRouter.get('/',async(req,res)=>{
    const tags = await getAllTags();
    res.send({
        tags
    })
});

tagsRouter.get('/:tagName/posts',async(req,res,next)=>{
    const {tagName} = req.params
    console.log('tags:',tagName);
   
})

module.exports=tagsRouter;