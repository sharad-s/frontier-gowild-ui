import { FlightDetails } from "../types/flights";

export const getTimeDifferenceInMinutes = (departureTime: string) => {
    const currentTime = new Date();
    const [hour, minute] = departureTime.split(':').map(Number);
    const departureDateTime = new Date(currentTime);
    departureDateTime.setHours(hour, minute, 0, 0);
    return (departureDateTime.getTime() - currentTime.getTime()) / 60000; // To get the difference in minutes
};


export const categorizeFlights = (flights: FlightDetails[]) => {
    const departed: FlightDetails[] = [];
    const departingSoon: FlightDetails[] = [];
    const available: FlightDetails[] = [];

    flights.forEach((flight) => {
        const timeDifference = getTimeDifferenceInMinutes(flight.departure_time);
        if (timeDifference < 0) {
            departed.push(flight);
        } else if (timeDifference >= 0 && timeDifference <= 30) {
            departingSoon.push(flight);
        } else {
            available.push(flight);
        }
    });

    return { departed, departingSoon, available };
};


const formatDateToBookingFormat = (date: string) => {
    const [month, day, year] = date.split('-');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[parseInt(month) - 1]} ${parseInt(day)}, ${year}`;
  };
  
  export const buildBookingUrl = (origin: string, destination: string, date: string) => {
    const formattedDate = formatDateToBookingFormat(date);
    return `https://booking.flyfrontier.com/Flight/InternalSelect?o1=${origin}&d1=${destination}&dd1=${formattedDate}&ADT=1&mon=true&promo=`;
  };
  