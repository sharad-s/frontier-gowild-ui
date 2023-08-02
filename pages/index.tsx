import Head from 'next/head'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Flight, FlightDetails } from '../src/types/flights';
import { DESTINATIONS } from '../src/constants';

export default function Home() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [filter, setFilter] = useState({
    date: '',
    origin: '',
    destination: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/flights', {
          params: filter,
        });
        setFlights(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [filter]);

  // Create an array of dates for the next week
  const nextWeekDates = new Array(7).fill(0).map((_, index) => {
    const dateObj = new Date();
    dateObj.setDate(dateObj.getDate() + index);
    return dateObj.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-');;
  });

  // Group flights by origin and date
  const groupedFlights = flights.reduce((acc, flightData) => {
    const { origin, date } = flightData;
    const key = `${origin}_${date}`;

    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push(flightData);

    return acc;
  }, {});

  const sortedGroupKeys = Object.keys(groupedFlights).sort((a, b) => {
    const [originA, dateA] = a.split("_");
    const [originB, dateB] = b.split("_");

    if (originA !== originB) {
      return originA.localeCompare(originB);
    }

    // @ts-ignore
    return new Date(dateA) - new Date(dateB);
  });


  return (
    <div className="container mx-auto px-4 md:px-0">
      <Head>
        <title>Frontier GoWild Tool</title>
      </Head>

      <h1 className="text-xl font-bold mb-4">Frontier GoWild Tool</h1>

      <div className="mb-2">
        <button onClick={() => setFilter({ ...filter, date: '' })} className={`px-3 py-2 mr-2 rounded-full ${filter.date === '' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>All</button>
        {nextWeekDates.map((date) => (
          <button key={date} onClick={() => setFilter({ ...filter, date })} className={`px-3 py-2 mr-2 rounded-full ${filter.date === date ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>{date}</button>
        ))}
      </div>

      <div className="mb-4">
        <select className="border px-3 py-2 mr-2" value={filter.origin} onChange={(e) => setFilter({ ...filter, origin: e.target.value })}>
          <option value="">Select Origin</option>
          {Object.entries(DESTINATIONS).map(([code, name]) => (
            <option key={code} value={code}>({code}) {name} </option>
          ))}
        </select>

        <select className="border px-3 py-2" value={filter.destination} onChange={(e) => setFilter({ ...filter, destination: e.target.value })}>
          <option value="">Select Destination</option>
          {Object.entries(DESTINATIONS).map(([code, name]) => (
            <option key={code} value={code}>{name}</option>
          ))}
        </select>
      </div>

      {sortedGroupKeys.map((groupKey) => {
      const [origin, date] = groupKey.split("_");

      return (
        <div key={groupKey}>
          <h2 className="text-2xl font-bold mb-4">{origin} - {date}</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {groupedFlights[groupKey].map((flightData) => (
              flightData.flights.map((flight: FlightDetails, index: number) => (
                <FlightCard key={`${flightData._id}_${index}`} flight={flight} flightData={flightData} />
              ))
            ))}
          </div>
        </div>
      )
    })}
    </div>
  )
}



interface FlightCardProps {
  flight: FlightDetails;
  flightData: any; // Use the appropriate type for flightData
}

const FlightCard: React.FC<FlightCardProps> = ({ flight, flightData }) => {
  console.log({ flight, flightData });
  return (
    <div className="border p-4 rounded-lg shadow-sm bg-white flex flex-col relative">
      <div className="flex flex-col md:flex-row justify-between items-start">
        <h2 className="text-lg font-bold mb-2 md:mb-0">({flightData.destination}) {flightData.destination_fullname}</h2>
        <div className="text-sm text-gray-500 flex flex-col items-end">
          <span className="inline-block bg-blue-500 text-white px-2 py-1 rounded mb-1">{flight.price}</span>
          <span>{flightData.date}</span>
        </div>
      </div>

      <div className="mt-4">
        <p className="mb-2"><strong>Flight Details</strong></p>
        <p className="text-sm text-gray-500">Departure: {flight.departure_time}</p>
        <p className="text-sm text-gray-500">Arrival: {flight.arrival_time}</p>
        <p className="text-sm text-gray-500">Stop type: {flight.stop_type}</p>
      </div>
    </div>
  );
}
