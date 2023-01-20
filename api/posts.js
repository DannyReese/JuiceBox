const express = require('express');
const postsRouter = express.Router();
const { getAllPosts, createPost, getPostById, updatePost } = require('../db');
const { requireUser } = require('./utils');

postsRouter.use((req, res, next) => {
  console.log('sending a little something from POSTS');
  next()
});


postsRouter.post('/', requireUser, async (req, res, next) => {
  const { title, content, tags = "" } = req.body;
  const tagsArr = tags.trim().split(/\s+/)
  const postData = {};
  if (tagsArr.length) {
    postData.tags = tagsArr;
  }
  try {
    postData.authorId = req.user.id
    postData.title = title
    postData.content = content
    const post = await createPost(postData)
    if (post) {
      res.send({ post });
    }
  } catch ({ name, message }) {
    next([name, message])
  }
});


postsRouter.patch('/:postId', requireUser, async (req, res, next) => {
  const { postId } = req.params;
  const { title, content, tags } = req.body;

  const updateFields = {};

  if (tags && tags.length > 0) {
    updateFields.tags = tags.trim().split(/\s+/);
  }

  if (title) {
    updateFields.title = title;
  }

  if (content) {
    updateFields.content = content;
  }

  try {
    const originalPost = await getPostById(postId);

    if (originalPost.author.id === req.user.id) {
      const updatedPost = await updatePost(postId, updateFields);
      res.send({ post: updatedPost })
    } else {
      next({
        name: 'UnauthorizedUserError',
        message: 'You cannot update a post that is not yours'
      })
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

postsRouter.delete('/:postId', requireUser, async (req, res, next) => {
  try {
    const { postId } = req.params
    const post = await getPostById(postId)

    if (post && post.author.id === req.user.id) {
      const updatedPost = await updatePost(post.id, { active: false });
      res.send({ post: updatedPost });
    } else {
      next(post ? {
        name: "UnauthorizedUserError",
        message: "You cannot delete a post that is not yours"
      } : {
        name: "PostNotFoundError",
        message: "That post does not exist"
      })
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});


postsRouter.get('/', async (req, res) => {
  const allPosts = await getAllPosts()
  const post = allPosts.filter(post => {
    return post.active || (req.user && post.author.id === req.user.id);
  })
console.log(post)
  res.send(
    { posts: post }
  );
});



module.exports = postsRouter;

