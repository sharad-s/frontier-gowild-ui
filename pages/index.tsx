import Head from 'next/head'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { FlattenedFlight, Flight, FlightDetails } from '../src/types/flights';
import { DESTINATIONS } from '../src/constants';
import AirportLocator from '../src/components/AirportLocator';
import { FlightCard } from '../src/components/FlightCard';

const getTodaysDate = () => {
  const dateObj = new Date();
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = dateObj.getFullYear();
  return `${month}-${day}-${year}`;
};

export default function Home() {
  const [flights, setFlights] = useState<FlattenedFlight[]>([]);
  const [filter, setFilter] = useState({
    date: getTodaysDate(),
    origin: '',
    destination: '',
  });

  console.log({ flights })

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
  const groupedFlights: {
    [key: string]: FlattenedFlight
  } = flights.reduce((acc, flightData) => {
    const { origin, date } = flightData;
    const key = `${origin}_${date}`;

    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push(flightData);

    return acc;
  }, {});


  // Sort the group keys by origin and date
  const sortedGroupKeys = Object.keys(groupedFlights).sort((a, b) => {
    const [originA, dateA] = a.split("_");
    const [originB, dateB] = b.split("_");

    if (originA !== originB) {
      return originA.localeCompare(originB);
    }

    // @ts-ignore
    return new Date(dateA) - new Date(dateB);
  });


  const setOrigin = (originCode) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      origin: originCode,
    }));
  };

  return (
    <div className="container mx-auto px-4 md:px-0">
      <Head>
        <title>Frontier GoWild Tool</title>
      </Head>

      <h1 className="text-xl font-bold mb-4">Frontier GoWild Tool</h1>

      <div className="mb-2">
        {nextWeekDates.map((date) => (
          <button key={date} onClick={() => setFilter({ ...filter, date })} className={`px-3 py-2 mr-2 rounded-full ${filter.date === date ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>{date}</button>
        ))}
      </div>

      <AirportLocator setOrigin={setOrigin} />

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
              {Object.keys(groupedFlights).map((key: string, index) => (
                <FlightCard key={`${groupedFlights[key]._id}_${index}`} flight={groupedFlights[key]} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}


