import { MongoClient } from 'mongodb';
import { NextApiRequest, NextApiResponse } from 'next';

type Filter = {
    date?: string;
    origin?: string;
    destination?: string;
};

const MONGO_URI = "mongodb://mongo:JU7I4CFvzgb2M29YcaMp@containers-us-west-48.railway.app:6932"

const client = new MongoClient(MONGO_URI);

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        // Connect to the MongoDB client
        await client.connect();

        // Get the 'flights' collection
        const collection = client.db('flights').collection('flights');

        // Prepare filter object based on query parameters
        const filter: Filter = {};
        if (req.query.date) filter.date = req.query.date as string;
        if (req.query.origin) filter.origin = req.query.origin as string;
        if (req.query.destination) filter.destination = req.query.destination as string;

        // Find documents in the collection based on filter
        const documents = await collection.find(filter).toArray();

        // Send the documents to the client
        res.status(200).json(documents);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Something went wrong.' });
    }
};
