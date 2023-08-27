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

        // const now = moment();

        // const departed = [];
        // const departingSoon = [];
        // const available = [];

        // documents.forEach(doc => {
        //     const originTimezone = 'America/Chicago';  // You would dynamically determine this based on doc.origin
        //     const localDepartureTime = `${doc.date} ${doc.flights[0].departure_time} ${originTimezone}`; // Format should be 'MM-DD-YYYY hh:mm A Z'

        //     const departureTime = moment.tz(localDepartureTime, 'MM-DD-YYYY hh:mm A Z', originTimezone);
        //     const diffInMinutes = departureTime.diff(now, 'minutes');

        //     if (diffInMinutes < 0) {
        //         departed.push(doc);
        //     } else if (diffInMinutes >= 0 && diffInMinutes <= 30) {
        //         departingSoon.push(doc);
        //     } else {
        //         available.push(doc);
        //     }
        // });


        // Send the documents to the client
        res.status(200).json(documents)
        // res.status(200).json({
        //     departed,
        //     departingSoon,
        //     available
        // });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Something went wrong.' });
    }
};

import moment from 'moment-timezone';
