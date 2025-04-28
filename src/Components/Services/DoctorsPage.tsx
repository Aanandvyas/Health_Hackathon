import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Doctor {
  _id: string;
  name: string;
  title: string;
  speciality: string;
  experience: string;
  gender: string;
  profileLink: string;
  imageUrl: string;
}

interface Appointment {
  _id?: string;
  doctorId: string;
  doctorName: string;
  date: Date;
  time: string;
}

const DoctorsPage: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const [filters, setFilters] = useState({ speciality: "", experience: "" });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("http://localhost:3001/doctors");
        setDoctors(response.data);
      } catch (error) {
        console.error("Failed to fetch doctors", error);
      }
    };

    const fetchAppointments = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/appointments", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Response data:", response.data);
       
        let appointmentsArray: any[] = [];
        if (Array.isArray(response.data)) {
          appointmentsArray = response.data;
        } else if (response.data && Array.isArray(response.data.appointments)) {
          appointmentsArray = response.data.appointments;
        }
        const appointmentsData = appointmentsArray.map((appointment: any) => ({
          ...appointment,
       
          doctorId: appointment.doctorId || appointment.doctor_id,
          date: new Date(appointment.date),
        }));
        setAppointments(appointmentsData);
      } catch (error) {
        console.error("Failed to fetch appointments", error);
      }
    };

    const fetchData = async () => {
      setIsLoading(true);
      await fetchDoctors();
      if (token) await fetchAppointments();
      setIsLoading(false);
    };

    fetchData();
  }, [token]);

  const handleBookAppointment = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      alert("Please select a doctor, date, and time before booking!");
      return;
    }
  
    try {
      const response = await axios.post(
        "http://localhost:3001/api/appointments/book",
        {
          doctorId: selectedDoctor._id,
          date: selectedDate.toISOString(),
          time: selectedTime,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      let newAppointmentsArray: any[] = [];
      if (response.data && Array.isArray(response.data.appointments)) {
        newAppointmentsArray = response.data.appointments;
      }
      const newAppointments = newAppointmentsArray.map((appointment: any) => ({
        ...appointment,
        doctorId: appointment.doctorId || appointment.doctor_id,
        date: new Date(appointment.date),
      }));
      setAppointments(newAppointments);
      alert("Appointment booked successfully!");
      setSelectedDoctor(null);
      setSelectedDate(null);
      setSelectedTime("");
      setShowCalendar(false);
    } catch (error: any) {
      console.error("Error booking appointment:", error.response?.data || error.message);
      alert("Failed to book appointment. Login first.");
    }
  };
  

  const handleCancelAppointment = async (appointmentId: string) => {
    if (!appointmentId) {
      alert("Invalid appointment ID");
      return;
    }
  
    try {
      console.log("Cancelling appointment with ID:", appointmentId); // Log the ID for debugging
  
      const response = await axios.delete(`http://localhost:3001/api/appointments/${appointmentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      if (response.status === 204) { // Assuming 204 No Content for successful deletion
        // Filter out the cancelled appointment from the state
        setAppointments(appointments.filter((appointment) => appointment._id !== appointmentId));
        alert("Appointment has been cancelled.");
      } else {
        throw new Error('Unexpected response from the server.');
      }
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      alert("Failed to cancel appointment.");
    }
  };
  


  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTime(event.target.value);
  };

  const timeOptions = ["9:00 AM", "10:00 AM", "11:00 AM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM"].map((time) => (
    <option key={time} value={time}>
      {time}
    </option>
  ));

  const filteredDoctors = doctors.filter((doctor) => {
    return (
      (filters.speciality === "" || doctor.speciality.toLowerCase().includes(filters.speciality.toLowerCase())) &&
      (filters.experience === "" || doctor.experience.toLowerCase().includes(filters.experience.toLowerCase()))
    );
  });

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex max-w-7xl mx-auto mt-12 p-4">
      {/* Left Panel */}
      <div className="w-1/4 p-4 border-r">
        <h3 className="text-xl font-semibold mb-4">Filters</h3>
        <input
          type="text"
          value={filters.speciality}
          onChange={(e) => setFilters({ ...filters, speciality: e.target.value })}
          placeholder="Search by speciality"
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
        <input
          type="text"
          value={filters.experience}
          onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
          placeholder="Search by experience"
          className="w-full p-2 border border-gray-300 rounded"
        />
        <h3 className="text-xl font-semibold mt-8 mb-4">Your Appointments</h3>
        <ul>
          {appointments.map((appointment, index) => (
            <li key={index} className="mb-2 flex justify-between items-center">
              <span>
                {`${appointment.doctorName}: ${appointment.date.toLocaleDateString()} at ${appointment.time}`}
              </span>
              <button
                onClick={() => appointment._id && handleCancelAppointment(appointment._id)} // Use _id here
                className="bg-red-500 text-white px-2 py-1 rounded ml-2 hover:bg-red-700"
              >
                Cancel
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Doctors Grid */}
      <div className="w-3/4 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <div key={doctor._id} className="border rounded-lg p-4 shadow-md flex flex-col">
              <img
                src={doctor.imageUrl}
                alt={doctor.name}
                className="w-32 h-32 object-cover rounded-full mx-auto"
              />
              <h2 className="font-semibold text-xl text-center mt-2">{doctor.name}</h2>
              <p className="text-center text-gray-500">{doctor.speciality}</p>
              <p className="text-center text-gray-500">Experience: {doctor.experience}</p>
              
              {/* This div will take available space and push the button down */}
              <div className="flex-grow"></div>
            
              <div className="text-center mt-4">
                <button
                  onClick={() => {
                    setSelectedDoctor(doctor);
                    setShowCalendar(true);
                  }}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mt-auto"
                >
                  Book an Appointment
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Calendar Modal */}
      {showCalendar && selectedDoctor && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg relative">
            <button
              onClick={() => setShowCalendar(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
            <h3 className="text-xl font-semibold mb-4">Select Date and Time</h3>
            <DatePicker selected={selectedDate} onChange={handleDateChange} inline />
            <select
              value={selectedTime}
              onChange={handleTimeChange}
              className="mt-4 p-2 border border-gray-300 rounded w-full"
            >
              <option value="">Select Time</option>
              {timeOptions}
            </select>
            <button
              onClick={handleBookAppointment}
              className="bg-green-500 text-white px-4 py-2 rounded-lg mt-4 hover:bg-green-700 w-full"
            >
              Confirm Appointment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorsPage;
