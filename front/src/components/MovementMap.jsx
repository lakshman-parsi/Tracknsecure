import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Circle,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import * as turf from "@turf/turf";

// Custom marker icon
const customMarkerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const riskColorMapping = {
  Safe: "green",
  "Low Risk": "orange",
  "Moderate Risk": "yellow",
  "High Risk": "red",
};

const MovementMap = ({ src, des }) => {
  const [path, setPath] = useState([]); // Stores the route coordinates
  const [currentPosition, setCurrentPosition] = useState(src); // Current position of the marker
  const [index, setIndex] = useState(0); // Index for animating the marker
  const [loggedPoints, setLoggedPoints] = useState([]); // Logged points every kilometer
  const [distanceTraveled, setDistanceTraveled] = useState(0); // Total distance traveled
  const [riskLevels, setRiskLevels] = useState([]);

  // Fetch the route from OSRM
  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const response = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${src[1]},${src[0]};${des[1]},${des[0]}?overview=full&geometries=geojson`
        );
        const data = await response.json();
        const coordinates = data.routes[0].geometry.coordinates;
        const latLngs = coordinates.map(([lng, lat]) => [lat, lng]); // Convert to [lat, lng]
        setPath(latLngs);
      } catch (error) {
        console.error("Error fetching route:", error);
      }
    };

    fetchRoute();
  }, [src, des]);

  // Simulate marker movement along the path
  useEffect(() => {
    if (path.length > 0 && index < path.length - 1) {
      const interval = setInterval(() => {
        const nextPosition = path[index];
        const prevPosition = currentPosition;

        // Calculate distance between points
        const distance = turf.distance(
          turf.point([prevPosition[1], prevPosition[0]]), // [lng, lat]
          turf.point([nextPosition[1], nextPosition[0]]), // [lng, lat]
          { units: "kilometers" }
        );

        // Update total distance traveled
        const updatedDistance = distanceTraveled + distance;
        setDistanceTraveled(updatedDistance);

        // Log point every 1 kilometer
        if (Math.floor(updatedDistance) > Math.floor(distanceTraveled)) {
          setLoggedPoints((prev) => [...prev, nextPosition]);
        }

        setCurrentPosition(nextPosition);
        setIndex((prevIndex) => prevIndex + 1);
      }, 100); // Adjust speed (100ms per step)

      return () => {
        clearInterval(interval);
      };
    }
  }, [path, index, currentPosition, distanceTraveled]);

  // Handle logged points and risk levels
  useEffect(() => {
    const coordinatesArray = loggedPoints.map(([lat, lng]) => ({
      latitude: lat,
      longitude: lng,
    }));

    if (loggedPoints.length > 0) {
      const websocket = new WebSocket("ws://localhost:8000/ws/predict-risk/");

      websocket.onopen = () => {
        console.log("WebSocket connection established");
        websocket.send(JSON.stringify(coordinatesArray));
      };

      websocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("Risk level data:", data);

        // Validate data and append to riskLevels state
        if (Array.isArray(data)) {
          setRiskLevels((prev) => [...prev, ...data]);
        } else {
          console.error("Unexpected WebSocket data format:", data);
        }
      };

      websocket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };
      websocket.onclose = () => {
        console.log("WebSocket connection closed");
      };
    }
  }, [loggedPoints]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <MapContainer center={src} zoom={10} style={{ flexGrow: 1 }}>
        {/* Base Tile Layer */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Draw the route as a polyline */}
        {path.length > 0 && <Polyline positions={path} color="blue" />}

        {/* Marker that moves along the route */}
        <Marker position={currentPosition} icon={customMarkerIcon} />

        {/* Circle with 100m radius around the marker */}
        <Circle
          center={currentPosition}
          radius={100} // 100 meters radius
          color="red"
          fillColor="red"
          fillOpacity={0.2}
        />

        {/* Draw Risk Circles */}
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
      </MapContainer>

      {/* Logged Points */}
      <div
        style={{
          padding: "10px",
          backgroundColor: "#f8f8f8",
          overflowY: "auto",
        }}
      >
        <h3>Logged Points (Every Kilometer)</h3>
        {/* <ul>
          {loggedPoints.map((point, idx) => (
            <li key={idx}>
              Latitude: {point[0].toFixed(6)}, Longitude: {point[1].toFixed(6)}
            </li>
          ))}
        </ul> */}
      </div>
    </div>
  );
};

export default MovementMap;
