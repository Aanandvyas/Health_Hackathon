// import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './Components/Main/HomePage';
import ServicePage from './Components/Services/ServicePage';
import Landing from './Components/AboutPage/Landing';
import DoctorsPage from './Components/Services/DoctorsPage';
import Header from './Components/Header/Header';
import Login from './Components/authPage/Login';
import Register from './Components/authPage/Register';


function App() {
  return (
    <Router>
      <div className="text-[#1d4d85] app min-w-[280px] min-h-screen bg-background">
         <Header/>
        <Routes>
          <Route path="/Health-Menta/login" element={<Login />} />
          <Route path="/Health-Menta/register" element={<Register />} />
          <Route path="/Health-Menta" element={<HomePage />} />
          <Route path="/Health-Menta/Services" element={<ServicePage/>} />
          <Route path="/Health-Menta/About" element={<Landing />} />
          <Route path="/Health-Menta/Doctors" element={<DoctorsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
