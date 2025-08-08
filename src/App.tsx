import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Components/Header/Header';
import PageLoader from './Components/UI/PageLoader'; // Your loading spinner component

// Lazily load all the page components.
// The code for these pages will now be in separate files.
const HomePage = lazy(() => import('./Components/Main/HomePage'));
const ServicePage = lazy(() => import('./Components/Services/ServicePage'));
const Landing = lazy(() => import('./Components/AboutPage/Landing'));
const DoctorsPage = lazy(() => import('./Components/Services/DoctorsPage'));
const Login = lazy(() => import('./Components/authPage/Login'));
const ForgotPassword = lazy(() => import('./Components/authPage/ForgotPassword'));
const Register = lazy(() => import('./Components/authPage/Register'));

function App() {
  return (
    <Router>
      <div className="text-[#1d4d85] app min-w-[280px] min-h-screen bg-background">
        <Header />
        {/* The Suspense component shows a fallback while the lazy components are loading */}
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/Services" element={<ServicePage />} />
            <Route path="/About" element={<Landing />} />
            <Route path="/Doctors" element={<DoctorsPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
