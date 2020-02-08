require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const postsRoutes = require('./routes/posts')

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

app.use('/api/posts', postsRoutes)

module.exports = app
