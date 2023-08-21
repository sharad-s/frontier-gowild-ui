import React, { useState, useEffect } from 'react';
import { DESTINATIONS_FULL } from '../constants';

const airportData = DESTINATIONS_FULL




const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
};

const AirportLocator = ({ setOrigin }) => {
    const [userLocation, setUserLocation] = useState(null);
    const [nearestAirport, setNearestAirport] = useState(null);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ lat: latitude, lon: longitude });
            },
            (error) => {
                console.log(error);
            },
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
    }, []);

    useEffect(() => {
        if (userLocation) {
            let nearest = null;
            let nearestDistance = Infinity;

            for (const [code, data] of Object.entries(airportData)) {
                const distance = getDistanceFromLatLonInKm(
                    userLocation.lat,
                    userLocation.lon,
                    data.lat,
                    data.lon
                );

                if (distance < nearestDistance) {
                    nearest = { code, ...data };
                    nearestDistance = distance;
                }
            }

            setNearestAirport(nearest);
        }
    }, [userLocation]);

    useEffect(() => {
        if (nearestAirport) {
            // Call the setOrigin function when a nearest airport is found
            setOrigin(nearestAirport.code);
        }
    }, [nearestAirport]);

    return (
        <div>
            <h1>Nearest Airport Locator</h1>
            {/* {userLocation && (
                <div>
                    <h2>Your Location</h2>
                    <p>Latitude: {userLocation.lat}</p>
                    <p>Longitude: {userLocation.lon}</p>
                </div>
            )}
            {nearestAirport && (
                <div>
                    <h2>Nearest Airport</h2>
                    <p>Code: {nearestAirport.code}</p>
                    <p>Name: {nearestAirport.name}</p>
                    <p>Latitude: {nearestAirport.lat}</p>
                    <p>Longitude: {nearestAirport.lon}</p>
                </div>
            )} */}
        </div>
    );
};

export default AirportLocator;
