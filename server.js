const express = require('express')
const app = express()
const port = 3000

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile('public/index.html', {root:__dirname})
})


app.get('/level', (req, res) => {
  res.sendFile('public/level.html', {root:__dirname})
})


app.get('/quiz', (req, res) => {
  res.sendFile('public/quiz.html', {root:__dirname})
})

app.listen(port, () => {
  console.log(`Server listening on port ${port} at http://localhost:${port}`)
}) 