export type FlightDetails = {
    flight_number: number;
    stop_type: string;
    departure_time: string;
    arrival_time: string;
    total_flight_time: string;
    stop_duration: string;
    price: string;
    standard_fare: string;
    discount_den_fare: string;
    carrier_code: string;
    is_next_day_arrival: boolean;
    is_lowest_fare: boolean;
    is_go_wild_fare_enabled: boolean;
    go_wild_seats_remaining: null | number;  // Assuming it could be a number as well when not null
}

export type Flight = {
    _id: string;
    date: string;
    destination: string;
    origin: string;
    destination_fullname: string;
    flights: FlightDetails[];
    last_updated: string;
}

export type Records = Flight[];
