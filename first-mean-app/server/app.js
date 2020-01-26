const express = require('express')
const bodyParser = require('body-parser')

const app = express()

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
  const post = req.body
  console.log(post, 'post')
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
