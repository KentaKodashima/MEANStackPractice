require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const Post = require('./models/post')

const app = express()

mongoose.connect(`mongodb+srv://admin:${process.env.MONGO_DB_USER_PASSWORD}@first-mean-app-db-mkubi.mongodb.net/node-angular?retryWrites=true&w=majority`)
  .then(() => {
    console.log('Connected')
  })
  .catch((e) => {
    console.log(e, 'Connection failed.')
  })

app.use(bodyParser.json())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS'
  )

  next()
})

app.post('/api/posts', async (req, res, next) => {
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

app.patch('/api/posts/:id', async (req, res, next) => {
  const { id, title, content } = req.param
  const post = new Post({
    title,
    content
  })
  const result = await Post.updateOne({ _id: id }, post)
  res.status(200).json({ message: 'Update successful' })
})

app.get('/api/posts', async (req, res, next) => {
  const posts = await Post.find()
  res.status(200).json({
    message: 'Post fetched successfully',
    posts: posts
  })
})

app.delete('/api/posts/delete/:id', async (req, res, next) => {
  const result = await Post.deleteOne({ _id: req.params.id })
  console.log(result)
  res.status(200).json({ message: 'Post deleted successfully' })
})

module.exports = app
