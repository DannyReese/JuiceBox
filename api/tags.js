const express = require('express');
const tagsRouter = express.Router();
const { getAllTags, getPostsByTagName } = require('../db')

tagsRouter.use((req, res, next) => {
    console.log('sending a little somthing from TAGS');

    next()
});

tagsRouter.get('/', async (req, res) => {
    const tags = await getAllTags();
    res.send({
        tags
    })
});

tagsRouter.get('/:tagName/posts', async (req, res, next) => {
    const { tagName } = req.params
    try {
        const allpostFromTag = await getPostsByTagName(tagName)
        const postFromTag = allpostFromTag.filter(post => {
            return (post.active && post.author.active) || (req.user && post.author.id === req.user.id);
          })
          console.log(postFromTag)
        res.send({ posts: postFromTag })


    } catch ({ name, message }) {
        next({ name, message })

    }
})

module.exports = tagsRouter;