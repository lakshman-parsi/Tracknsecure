import React, { useState, useEffect } from "react";
import { FaMapMarkedAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { useMap } from "react-leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Circle,
} from "react-leaflet";
import GetPath from "../components/GetPath";

const Livetrack = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [sourceCoordinates, setSourceCoordinates] = useState([]);
  const [riskLevels, setRiskLevels] = useState([]);
  const [startJourney, setStartJourney] = useState(false);

  const riskColorMapping = {
    Safe: "green",
    "Low Risk": "orange",
    "Moderate Risk": "yellow",
    "High Risk": "red",
  };
  const MapUpdater = () => {
    const map = useMap(); // Access the map instance
    useEffect(() => {
      if (userLocation) {
        map.setView([userLocation.lat, userLocation.lng], 13); // Update map center when userLocation changes
      }
    }, [userLocation, map]);

    return null; // This component doesn't render anything
  };
  const predefinedCoordinates = [
    { latitude: 34.0465, longitude: -118.2488 },
    { latitude: 34.0183, longitude: -118.3504 },

    { latitude: 33.7808, longitude: -118.273 },
    { latitude: 34.0052, longitude: -118.2991 },
    { latitude: 34.1599, longitude: -118.4766 },
    { latitude: 34.1921, longitude: -118.4662 },
    { latitude: 34.2289, longitude: -118.6108 },
    { latitude: 34.0319, longitude: -118.2113 },
    { latitude: 34.1307, longitude: -118.1907 },
    { latitude: 34.0226, longitude: -118.207 },
    { latitude: 33.7798, longitude: -118.2664 },
    { latitude: 34.2012, longitude: -118.5502 },
    { latitude: 34.0462, longitude: -118.2165 },
    { latitude: 34.0998, longitude: -118.3211 },

    { latitude: 33.7976, longitude: -118.261 },
    { latitude: 34.0412, longitude: -118.2474 },
    { latitude: 34.0854, longitude: -118.3522 },
    { latitude: 34.0073, longitude: -118.298 },
    { latitude: 34.0452, longitude: -118.2569 },
    { latitude: 34.1504, longitude: -118.4312 },
    { latitude: 33.7358, longitude: -118.2924 },
    { latitude: 33.9948, longitude: -118.2565 },
    { latitude: 34.0467, longitude: -118.3406 },
    { latitude: 34.0536, longitude: -118.4662 },

    { latitude: 34.0836, longitude: -118.3016 },
    { latitude: 34.0028, longitude: -118.3007 },
    { latitude: 33.7817, longitude: -118.2574 },
    { latitude: 34.0889, longitude: -118.3405 },
    { latitude: 34.0073, longitude: -118.298 },
    { latitude: 34.0524, longitude: -118.1969 },
    { latitude: 34.0925, longitude: -118.3291 },
    { latitude: 33.9871, longitude: -118.2827 },
    { latitude: 34.1976, longitude: -118.4799 },
    { latitude: 33.9456, longitude: -118.2739 },
    { latitude: 34.1785, longitude: -118.4094 },
    { latitude: 34.098, longitude: -118.3645 },
    { latitude: 34.1866, longitude: -118.5535 },
    { latitude: 34.1774, longitude: -118.5387 },
    { latitude: 34.1318, longitude: -118.1957 },
    { latitude: 34.1993, longitude: -118.4724 },
    { latitude: 34.0216, longitude: -118.3296 },
    { latitude: 34.0909, longitude: -118.2917 },

    { latitude: 34.0448, longitude: -118.2504 },
    { latitude: 34.0467, longitude: -118.2556 },
    { latitude: 34.0515, longitude: -118.2073 },
    { latitude: 34.0617, longitude: -118.2795 },
    { latitude: 34.0633, longitude: -118.3473 },
    { latitude: 34.0726, longitude: -118.3279 },
    { latitude: 34.0835, longitude: -118.3734 },
    { latitude: 34.0184, longitude: -118.2952 },
    { latitude: 34.0071, longitude: -118.326 },
    { latitude: 33.7862, longitude: -118.2908 },
    { latitude: 33.737, longitude: -118.2879 },
    { latitude: 33.9456, longitude: -118.2483 },
    { latitude: 34.2319, longitude: -118.5417 },

    { latitude: 33.7968, longitude: -118.3076 },
    { latitude: 33.7854, longitude: -118.3042 },
    { latitude: 33.7916, longitude: -118.2915 },
    { latitude: 33.7916, longitude: -118.2915 },
    { latitude: 33.741, longitude: -118.2838 },
    { latitude: 34.0421, longitude: -118.2469 },
    { latitude: 33.7796, longitude: -118.2699 },
    { latitude: 33.7808, longitude: -118.2469 },
    { latitude: 34.2013, longitude: -118.4574 },
    { latitude: 33.9817, longitude: -118.3338 },
    { latitude: 33.7428, longitude: -118.2923 },
    { latitude: 33.7948, longitude: -118.2694 },
    { latitude: 33.7321, longitude: -118.295 },
    { latitude: 34.0064, longitude: -118.2916 },
    { latitude: 33.7406, longitude: -118.2906 },
    { latitude: 34.0153, longitude: -118.3045 },
    { latitude: 34.1921, longitude: -118.4662 },
    { latitude: 33.7415, longitude: -118.293 },
    { latitude: 33.7799, longitude: -118.2638 },
    { latitude: 33.8201, longitude: -118.3015 },
    { latitude: 33.9597, longitude: -118.4318 },
    { latitude: 33.9312, longitude: -118.2308 },
  ];
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          console.log("Initial Location:", latitude, longitude);
        },
        (error) => {
          console.error("Error fetching location:", error);
        }
      );
    }
  }, []);

  const generateEquidistantCoordinates = (
    latitude,
    longitude,
    radiusInKm,
    numberOfPoints
  ) => {
    const points = [];
    const earthRadius = 6371; // Earth radius in kilometers
    const angleIncrement = (2 * Math.PI) / numberOfPoints;

    for (let i = 0; i < numberOfPoints; i++) {
      const angle = angleIncrement * i;
      const deltaLat =
        (radiusInKm / earthRadius) * (180 / Math.PI) * Math.sin(angle);
      const deltaLon =
        ((radiusInKm / earthRadius) * (180 / Math.PI) * Math.cos(angle)) /
        Math.cos((latitude * Math.PI) / 180);

      points.push({
        latitude: latitude + deltaLat,
        longitude: longitude + deltaLon,
      });
    }

    return points;
  };

  const connectToWebSocket = (points) => {
    const ws = new WebSocket("ws://localhost:8000/ws/predict-risk/");
    ws.onopen = () => {
      console.log("WebSocket Connected");
      ws.send(JSON.stringify(points));
    };
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setRiskLevels(data);
      console.log("Risk Levels:", data);
    };
    ws.onerror = (error) => console.error("WebSocket Error:", error);
    ws.onclose = () => console.log("WebSocket Closed");
  };

  const handleJourneyStart = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    const getRandomCoordinates = () => {
      const randomIndex = Math.floor(
        Math.random() * predefinedCoordinates.length
      );
      return predefinedCoordinates[randomIndex];
    };

    const updateCoordinates = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // const { latitude, longitude } = position.coords;

          // const { latitude, longitude } = predefinedCoordinates[0];
          const { latitude, longitude } = getRandomCoordinates();
          setUserLocation({ lat: latitude, lng: longitude });
          console.log("Current Location:", latitude, longitude);
          // const { latitude, longitude }=predefinedCoordinates[0];
          const neighborPoints = generateEquidistantCoordinates(
            latitude,
            longitude,
            0.5,
            8
          );
          const allPoints = [{ latitude, longitude }, ...neighborPoints];
          setSourceCoordinates(allPoints);
          connectToWebSocket(allPoints);
        },
        (error) => console.error("Error updating location:", error)
      );
    };

    setStartJourney(true);
    updateCoordinates();
    const intervalId = setInterval(updateCoordinates, 1000);

    return () => clearInterval(intervalId);
  };

  const getBounds = () => {
    if (!sourceCoordinates.length) return null;
    const latitudes = sourceCoordinates.map((p) => p.latitude);
    const longitudes = sourceCoordinates.map((p) => p.longitude);

    return [
      [Math.min(...latitudes), Math.min(...longitudes)],
      [Math.max(...latitudes), Math.max(...longitudes)],
    ];
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white p-4 shadow-md">
        <div className="text-xl font-bold text-pink-600">SHE SECURE</div>
      </header>

      {userLocation && (
        <div className="container mx-auto mt-8 p-4 bg-white rounded-lg shadow-lg">
          <h3 className="text-xl text-gray-800 mb-4">Your Current Location</h3>
          <MapContainer
            center={[userLocation.lat, userLocation.lng]}
            zoom={13}
            style={{ height: "300px", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[userLocation.lat, userLocation.lng]}>
              {/* <Popup>Your Current Location</Popup> */}
            </Marker>
            {riskLevels.map((item, idx) => {
              if (!item.coordinates || !item.risk) {
                console.warn("Skipping invalid risk data:", item);
                return null;
              }
              const { coordinates, risk } = item;
              const color = riskColorMapping[risk] || "gray";
              return (
                <Circle
                  key={idx}
                  center={coordinates}
                  radius={500}
                  color={color}
                  fillColor={color}
                  fillOpacity={0.2}
                />
              );
            })}
            <MapUpdater />
          </MapContainer>
        </div>
      )}

      <div className="container mx-auto mt-8 p-4 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl text-gray-800 font-semibold mb-4">
          Start Your Journey
        </h2>
        <button
          type="button"
          className="px-6 py-3 bg-blue-500 text-white rounded-lg"
          onClick={handleJourneyStart}
        >
          Start Journey
        </button>
      </div>
    </div>
  );
};

export default Livetrack;
