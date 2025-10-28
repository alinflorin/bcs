import {QdrantClient} from '@qdrant/js-client-rest';

// TO connect to Qdrant running locally
const clientQdrant = new QdrantClient({url: process.env.QDRANT_URL});

export default clientQdrant;