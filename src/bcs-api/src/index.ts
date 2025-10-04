import express from 'express';

const app = express();
app.use(express.json());

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello, world!' });
});

app.listen(8080, () => {
  console.log('Server is running on http://localhost:8080');
});