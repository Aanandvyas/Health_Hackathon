import React, { useState, useEffect } from "react";
import axios from "axios";

const Dashboard: React.FC = () => {
  const [medicines, setMedicines] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [newMedicine, setNewMedicine] = useState({
    name: "",
    description: "",
    dosage: "",
    time: "",
  });

  const token = localStorage.getItem("token");

  // Fetch medicines from the backend
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await axios.get("http://localhost:3001/medicines", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMedicines(response.data);
      } catch (error) {
        console.error("Error fetching medicines:", error);
      }
    };

    const fetchAppointments = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/appointments", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Assuming you have a state for appointments
        setAppointments(response.data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    if (token) {
      fetchMedicines();
      fetchAppointments();
    }
  }, [token]);



  // Function to add a new medicine
  const addMedicine = async () => {
    if (!token) {
      alert("Please log in to add medicines.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/add-medicine",
        newMedicine,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMedicines(response.data.medicines);
      setAppointments(response.data.appointments);

      setNewMedicine({ name: "", description: "", dosage: "", time: "" });
    } catch (error) {
      console.error("Error adding medicine:", error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto p-6">
      {/* Medicines Section */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold">Medicines</h2>
        <div className="space-y-2 mt-4">
          <input
            type="text"
            placeholder="Medicine Name"
            value={newMedicine.name}
            onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
            className="border p-2 w-full rounded"
          />
          <input
            type="text"
            placeholder="Description"
            value={newMedicine.description}
            onChange={(e) => setNewMedicine({ ...newMedicine, description: e.target.value })}
            className="border p-2 w-full rounded"
          />
          <input
            type="text"
            placeholder="Dosage"
            value={newMedicine.dosage}
            onChange={(e) => setNewMedicine({ ...newMedicine, dosage: e.target.value })}
            className="border p-2 w-full rounded"
          />
          <input
            type="text"
            placeholder="Time"
            value={newMedicine.time}
            onChange={(e) => setNewMedicine({ ...newMedicine, time: e.target.value })}
            className="border p-2 w-full rounded"
          />
          <button onClick={addMedicine} className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full">
            Add Medicine
          </button>
        </div>

        <h3 className="mt-6 text-lg font-semibold">Your Medicines</h3>
        <ul className="mt-2 text-gray-600">
          {medicines.length > 0 ? (
            medicines.map((med, index) => (
              <li key={index} className="border p-2 rounded mt-2">
                <strong>{med.name}</strong> - {med.description}
                {med.dosage && ` (Dosage: ${med.dosage})`}
                {med.time && ` (Time: ${med.time})`}
              </li>
            ))
          ) : (
            <p>No medicines added.</p>
          )}
        </ul>
      </div>

      {/* Streak Section */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold">Streak</h2>
        <p className="text-gray-600 mt-2">Keep track of your streaks...</p>
        {/* Add streak tracking logic */}
      </div>

      {/* Tasks Section */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold">Tasks</h2>
        <p className="text-gray-600 mt-2">Manage your tasks...</p>
        {/* Add task management logic */}
      </div>

      {/* Appointment Section */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold">Appointments</h2>
        {appointments.length > 0 ? (
          appointments.map((appointment, index) => (
            <li key={index} className="border p-2 rounded mt-2">
              <strong>{appointment.title}</strong> - {appointment.description}
              {appointment.date && ` (Date: ${appointment.date})`}
              {appointment.time && ` (Time: ${appointment.time})`}
            </li>
          ))
        ) : (
          <p>No appointments added.</p>
        )}
        {/* Add note-taking functionality */}
      </div>

      {/* Profile Section */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold">Profile</h2>
        <p className="text-gray-600 mt-2">View and update your profile...</p>
        {/* Add profile details */}
      </div>

      {/* Graph Section */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold">Graph</h2>
        <svg viewBox="0 0 400 220" width="100%" height="auto">
          <rect width="100%" height="220" fill="white" />
          <line x1="50" y1="0" x2="50" y2="200" stroke="black" strokeWidth="2" />
          <line x1="50" y1="200" x2="400" y2="200" stroke="black" strokeWidth="2" />
          <polyline
            fill="none"
            stroke="rgba(75, 192, 192, 1)"
            strokeWidth="3"
            points={[10, 20, 15, 30, 25, 10]
              .map((value, index) => `${index * 50 + 50},${200 - value * 5}`)
              .join(" ")}
          />
          <g className="axis x-axis">
            {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((label, index) => (
              <text key={index} x={index * 50 + 50} y="215" textAnchor="middle" fontSize="12">
                {label}
              </text>
            ))}
          </g>
          <g className="axis y-axis">
            {[0, 10, 20, 30, 40].map((value, index) => (
              <text key={index} x="40" y={200 - value * 5} textAnchor="end" fontSize="12" dominantBaseline="middle">
                {value}
              </text>
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
};

export default Dashboard;
