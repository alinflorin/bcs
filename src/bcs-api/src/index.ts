import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { version } from './version';
import { MongoClient } from 'mongodb';
import { expressjwt as jwt } from 'express-jwt';
import jwksRsa from 'jwks-rsa';

const url = `mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOSTNAME}:27017/bcs`;
const client = new MongoClient(url);
const beaza = client.db('bcs')


const app = express();
app.use(express.json());

app.use(jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https:///.well-known/jwks.json`,
  }),
  audience: 'https://bcs-api',
  issuer: `https://auth0/`,
  algorithms: ['RS256'],
}));

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', version: version });
});

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello, world! Version: ' + version });
});


app.post('/api/chat/new',  async (req, res)=>{
})

app.listen(8080, () => {
  console.log('Server is running on http://localhost:8080');
});