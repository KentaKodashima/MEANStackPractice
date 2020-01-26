const http = require('http')

const app = http.createServer((req, res) => {
  res.end('This is my first server')
})

app.listen(process.env.PORT || 3000)
