import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";

const ReportForm = () => {
  const [incidentType, setIncidentType] = useState("");
  const [locationInput, setLocationInput] = useState(""); // Input for location search
  const [location, setLocation] = useState("");
  const [coordinates, setCoordinates] = useState({ lat: 51.505, lng: -0.09 }); // Default to London
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleImageChange = (e) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setImages(fileArray);
    }
  };

  const MapViewUpdater = ({ coords }) => {
    const map = useMap();
    map.setView([coords.lat, coords.lng], 13);
    return null;
  };

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setCoordinates({ lat, lng });
        setLocation(`Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`);
      },
    });

    return coordinates.lat && coordinates.lng ? (
      <Marker position={[coordinates.lat, coordinates.lng]} />
    ) : null;
  };

  const handleLocationSearch = async () => {
    if (!locationInput) {
      setErrorMessage("Please enter a location to search.");
      return;
    }
    setErrorMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          locationInput
        )}`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        setCoordinates({ lat: parseFloat(lat), lng: parseFloat(lon) });
        setLocation(`${display_name} (Lat: ${lat}, Lng: ${lon})`);
      } else {
        setErrorMessage("Location not found. Please try another search.");
      }
    } catch (error) {
      setErrorMessage("Error fetching location. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!incidentType || !location || !description) {
      setErrorMessage("Please fill in all the required fields.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    const formData = new FormData();
    formData.append("incidentType", incidentType);
    formData.append("location", location);
    formData.append("description", description);

    images.forEach((image) => {
      formData.append("images", image);
    });

    try {
      const response = await fetch("/api/incident-report", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        alert("Incident reported successfully!");
        setIncidentType("");
        setLocationInput("");
        setLocation("");
        setDescription("");
        setImages([]);
        setCoordinates({ lat: 51.505, lng: -0.09 });
      } else {
        setErrorMessage(data.message || "Something went wrong.");
      }
    } catch (error) {
      setErrorMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="incident-report" className="py-20 bg-gray-100 ">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Report an Incident
        </h2>
        <div className="bg-white shadow-md rounded-lg p-8 max-w-lg mx-auto">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Incident Type
              </label>
              <select
                value={incidentType}
                onChange={(e) => setIncidentType(e.target.value)}
                className="w-full p-4 border-2 border-gray-300 rounded-md"
                required
              >
                <option value="">Select Incident Type</option>
                <option value="Accident">Accident</option>
                <option value="Harassment">Harassment</option>
                <option value="Theft">Theft</option>
                <option value="Vandalism">Vandalism</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Location
              </label>
              <div className="flex items-center mb-2">
                <input
                  type="text"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  className="w-full p-4 border-2 border-gray-300 rounded-md"
                  placeholder="Search for a location"
                />
                <button
                  type="button"
                  onClick={handleLocationSearch}
                  className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  disabled={loading}
                >
                  Search
                </button>
              </div>
              <input
                type="text"
                value={location}
                readOnly
                className="w-full p-4 border-2 border-gray-300 rounded-md"
                placeholder="Selected location will appear here"
                required
              />
            </div>

            <div className="mb-4">
              <MapContainer
                center={[coordinates.lat, coordinates.lng]}
                zoom={13}
                style={{ height: "300px", width: "100%" }}
                className="rounded-md border-2 border-gray-300"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                <MapViewUpdater coords={coordinates} />
                <LocationMarker />
              </MapContainer>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
                className="w-full p-4 border-2 border-gray-300 rounded-md"
                placeholder="Describe the incident"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Upload Images (Optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                multiple
                className="w-full p-4 border-2 border-gray-300 rounded-md"
              />
              {images.length > 0 && (
                <div className="mt-4 flex space-x-4">
                  {images.map((image, index) => (
                    <img
                      key={index}
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      className="w-32 h-32 object-cover rounded-md"
                    />
                  ))}
                </div>
              )}
            </div>

            {errorMessage && (
              <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
            )}

            <button
              type="submit"
              className="w-full px-6 py-3 bg-pink-500 text-white rounded-lg shadow-lg hover:bg-pink-600"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Submit Report"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ReportForm;
