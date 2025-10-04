import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { version } from './version';

const app = express();
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', version: version });
});

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello, world! Version: ' + version });
});

app.listen(8080, () => {
  console.log('Server is running on http://localhost:8080');
});