const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const Post = require('./models/post')

const app = express()

mongoose.connect(`mongodb+srv://admin:${process.env.MONGO_DB_USER_PASSWORD}@first-mean-app-db-mkubi.mongodb.net/test?retryWrites=true&w=majority`)
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
    'GET, POST, PATCH, DELETE, OPTIONS'
  )

  next()
})

app.post('/api/posts', (req, res, next) => {
  const post = new Post({
    titlle: req.body.title,
    content: req.body.content
  })

  res.status(201).json({
    message: 'Post added successfully'
  })
})

app.use('/api/posts', (req, res, next) => {
  const posts = [
    {
      id: 'dfajofawd',
      title: 'first',
      content: 'server content'
    },
    {
      id: 'dfajofadafdfawd',
      title: 'second',
      content: 'server content'
    }
  ]
  res.status(200).json({
    message: 'Post fetched successfully',
    posts: posts
  })
})

module.exports = app
