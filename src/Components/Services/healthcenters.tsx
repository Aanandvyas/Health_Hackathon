import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// It's crucial to import the Leaflet CSS in your main App file (e.g., App.tsx or index.tsx)
// for the map to render correctly.
import 'leaflet/dist/leaflet.css';

// --- DEPENDENCIES ---
// You must install these packages in your project:
// npm install leaflet react-leaflet
// npm install --save-dev @types/leaflet

// --- FIX: Corrects the issue where default marker icons don't appear ---
// By casting the prototype to 'any', we tell TypeScript to ignore the type error for this line.
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});
// ---

// --- TYPE DEFINITIONS ---
// Define a type for the hospital data structure for type safety.
interface Hospital {
  name: string;
  latitude: number;
  longitude: number;
}

// --- HELPER COMPONENT ---
// This component automatically pans and zooms the map to fit the markers.
const ChangeView: React.FC<{ markers: Hospital[] }> = ({ markers }) => {
  const map = useMap();
  if (markers.length > 0) {
    const bounds = L.latLngBounds(markers.map(marker => [marker.latitude, marker.longitude]));
    map.fitBounds(bounds, { padding: [50, 50] });
  }
  return null;
}

// --- MAIN COMPONENT ---
const HealthCenters: React.FC = () => {
  // State management with TypeScript types
  const [postalCode, setPostalCode] = useState<string>("");
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Function to handle form input changes
  const handlePostalCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // Regex validation for a 6-digit number
    if (/^\d{0,6}$/.test(value)) {
      setPostalCode(value);
    }
  };

  // Async function to handle the search submission
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (postalCode.length !== 6) {
      setError("Please enter a valid 6-digit postal code.");
      return;
    }
    setLoading(true);
    setError("");
    setHospitals([]); // Clear previous results

    try {
      // Fetch data from your live Render backend
      const response = await fetch("https://my-interactive-map-backend.onrender.com/submit", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postal_code: postalCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "An unknown error occurred.");
      }
      
      if (data.hospitals && data.hospitals.length > 0) {
        setHospitals(data.hospitals);
      } else {
        setError("No hospitals found for this pincode.");
      }

    } catch (err: any) {
      setError(err.message || "Error fetching data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 flex flex-col h-screen">
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold">Find Nearby Health Centers</h2>
      </div>

      <form onSubmit={handleSearch} className="flex justify-center items-center space-x-2 mb-2">
        <input
          type="text"
          value={postalCode}
          onChange={handlePostalCodeChange}
          placeholder="Enter 6-digit postal code"
          maxLength={6}
          className="p-2 border rounded w-full max-w-xs"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {error && <p className="text-red-500 text-center mt-2">{error}</p>}

      <div className="mt-4 flex-grow rounded-lg shadow-lg overflow-hidden">
        <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {hospitals.map((hospital, index) => (
            <Marker key={index} position={[hospital.latitude, hospital.longitude]}>
              <Popup>
                <b>{hospital.name}</b>
              </Popup>
            </Marker>
          ))}

          <ChangeView markers={hospitals} />
        </MapContainer>
      </div>
    </div>
  );
};

export default HealthCenters;
