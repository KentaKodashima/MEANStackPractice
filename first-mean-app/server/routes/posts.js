const express = require('express')
const Post = require('../models/post')

const router = express.Router()

router.get('', async (req, res, next) => {
  const posts = await Post.find()
  res.status(200).json({
    message: 'Post fetched successfully',
    posts: posts
  })
})

router.get('/:id', async (req, res, next) => {
  const { id } = req.params
  const post = await Post.findById(id)
  if (post) {
    res.status(200).json(post)
  } else {
    res.status(404).json({ message: 'Post not forund' })
  }
})

router.post('', async (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  })
  const result = await post.save()
  res.status(201).json({
    message: 'Post added successfully',
    postId: result.id
  })
})

router.patch('/:id', async (req, res, next) => {
  const { id, title, content } = req.param
  const post = new Post({
    title,
    content
  })
  const result = await Post.updateOne({ _id: id }, post)
  res.status(200).json({ message: 'Update successful' })
})

router.delete('/delete/:id', async (req, res, next) => {
  const result = await Post.deleteOne({ _id: req.params.id })
  console.log(result)
  res.status(200).json({ message: 'Post deleted successfully' })
})

module.exports = router
