
// components/FlightCard.tsx
import React from 'react';
import { FlightDetails } from '../types/flights'; // Update path if needed

interface FlightCardProps {
    flight: FlightDetails;
    flightData: any; // Use the appropriate type for flightData
}

export const FlightCard: React.FC<FlightCardProps> = ({ flight, flightData }) => {
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
