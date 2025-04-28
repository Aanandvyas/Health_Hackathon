import React, { useState } from "react";
import axios from "axios";

const HealthCenters = () => {
  const [mapUrl, setMapUrl] = useState<string>("");
  const [postalCode, setPostalCode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Validate 6-digit postal code input
  const handlePostalCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (/^\d{0,6}$/.test(value)) {
      setPostalCode(value);
    }
  };

  // Function to send postal code to backend and get map URL
  const handleSearch = async () => {
    if (postalCode.length !== 6) {
      setError("Please enter a valid 6-digit postal code.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://127.0.0.1:3000/submit", {
        postal_code: postalCode,
      });

      if (response.status === 200) {
        setMapUrl(response.data.map_url);
      } else {
        setError(response.data.error || "No hospitals found.");
      }
    } catch (err) {
      setError("Error fetching data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Find Nearby Health Centers</h2>

      <div className="flex space-x-2">
        <input
          type="text"
          value={postalCode}
          onChange={handlePostalCodeChange}
          placeholder="Enter 6-digit postal code"
          maxLength={6}
          className="p-2 border rounded w-full"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-500 text-white rounded"
          disabled={loading}
        >
          {loading ? "Loading..." : "Search"}
        </button>
      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {mapUrl && (
        <div className="mt-6">
          <iframe
            src={mapUrl}
            title="Health Centers Map"
            width="100%"
            height="850vh"
            style={{ border: "none" }}
          />
        </div>
      )}
    </div>
  );
};

export default HealthCenters;
