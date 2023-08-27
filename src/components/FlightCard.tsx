
// components/FlightCard.tsx
import React from 'react';
import { FlattenedFlight, FlightDetails } from '../types/flights'; // Update path if needed
import { buildBookingUrl } from '../utils/time';

interface FlightCardProps {
    flight: FlattenedFlight;
}

export const FlightCard: React.FC<FlightCardProps> = ({ flight }) => {
    const { origin, destination, date } = flight;

    const handleBookingClick = () => {
        const url = buildBookingUrl(origin, destination, date);
        window.open(url, '_blank');
    };

    return (
        <div className="border p-4 rounded-lg shadow-sm bg-white flex flex-col relative">
            <div className="flex flex-col md:flex-row justify-between items-start">
                <h2 className="text-lg font-bold mb-2 md:mb-0">({flight.destination}) {flight.destination_fullname}</h2>
                <div className="text-sm text-gray-500 flex flex-col items-end">
                    <span className="inline-block bg-blue-500 text-white px-2 py-1 rounded mb-1">{flight.price}</span>
                    <span>{flight.date}</span>
                </div>
            </div>

            <div className="mt-4">
                <p className="mb-2"><strong>Flight Details</strong></p>
                <p className="text-sm text-gray-500">Departure: {flight.departure_time}</p>
                <p className="text-sm text-gray-500">Arrival: {flight.arrival_time}</p>
                <p className="text-sm text-gray-500">Stop type: {flight.stop_type}</p>
            </div>

            <button onClick={handleBookingClick} className="booking-button">
                Book Now
            </button>
        </div>
    );
}
