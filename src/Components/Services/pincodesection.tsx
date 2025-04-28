import { useState } from "react";

export default function PincodeSection({ children }: { children: React.ReactNode }) {
  const [pincode, setPincode] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const handlePincodeSubmit = () => {
    if (pincode.length === 6) {
      setIsVisible(true);
    } else {
      alert("Please enter a valid 6-digit Pincode.");
    }
  };

  return (
    <div className="flex flex-col items-center p-6">
      {/* Pincode Input */}
      <div className="mb-6">
        <label className="text-lg font-semibold">Enter Your Pincode:</label>
        <input
          type="text"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          className="border p-2 rounded-md mx-2"
          placeholder="e.g. 110001"
        />
        <button
          onClick={handlePincodeSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Submit
        </button>
      </div>

      {/* Show the existing sections only when pincode is entered */}
      {isVisible && children}
    </div>
  );
}
