import {QdrantClient} from '@qdrant/js-client-rest';

// TO connect to Qdrant running locally
const clientQdrant = new QdrantClient({url: process.env.QDRANT_URL, apiKey: process.env.QDRANT_API_KEY});

export default clientQdrant;