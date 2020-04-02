const express = require('express')
const Post = require('../models/post')
const multer = require('multer')

const router = express.Router()

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype]
    let error = null
    if (!isValid) {
      error = new Error('Invalid mime type')
    }
    cb(null, 'server/images')
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-')
    const ext = MIME_TYPE_MAP[file.mimetype]
    cb(null, name + '-' + Date.now() + '.' + ext)
  }
})

router.get('', async (req, res, next) => {
  const { pageSize, currentPage } = +req.query
  let posts = await Post.find()
  if (pageSize && currentPage) {
    posts
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize)
  }
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

router.post('', multer({ storage }).single('image'), async (req, res, next) => {
  const url = req.protocol + '://' + req.get('host')
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename
  })
  const result = await post.save()
  res.status(201).json({
    message: 'Post added successfully',
    post: {
      ...result,
      id: result._id
    }
  })
})

router.patch('/:id', multer({ storage }).single('image'), async (req, res, next) => {
  const { id, title, content } = req.body
  let imagePath = req.body.imagePath

  if (req.file) {
    const url = req.protocol + '://' + req.get('host')
    imagePath = `${url}/images/${req.file.filename}`
  }

  const post = new Post({
    _id: id,
    title,
    content,
    imagePath: imagePath
  })
  await Post.updateOne({ _id: req.params.id }, post)
  res.status(200).json({ message: 'Update successful' })
})

router.delete('/delete/:id', async (req, res, next) => {
  const result = await Post.deleteOne({ _id: req.params.id })
  console.log(result)
  res.status(200).json({ message: 'Post deleted successfully' })
})

module.exports = router
