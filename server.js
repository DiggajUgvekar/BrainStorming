import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import questionRoutes from './routes/questions.js';
const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', questionRoutes);

app.get('/', (req, res) => {
  res.sendFile('public/templates/index.html', {root:__dirname})
})


app.get('/level', (req, res) => {
  res.sendFile('public/templates/level.html', {root:__dirname})
})


app.get('/quiz', (req, res) => {
  res.sendFile('public/templates/quiz.html', {root:__dirname})
})

app.listen(port, () => {
  console.log(`Server listening on port ${port} at http://localhost:${port}`)
}) 