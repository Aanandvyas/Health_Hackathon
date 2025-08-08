import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Components/Header/Header';
import PageLoader from './Components/UI/PageLoader';

// Lazily load all the page components
const HomePage = lazy(() => import('./Components/Main/HomePage'));
const ServicePage = lazy(() => import('./Components/Services/ServicePage'));
const Landing = lazy(() => import('./Components/AboutPage/Landing'));
const DoctorsPage = lazy(() => import('./Components/Services/DoctorsPage'));
const Login = lazy(() => import('./Components/authPage/Login'));
const ForgotPassword = lazy(() => import('./Components/authPage/ForgotPassword'));
const Register = lazy(() => import('./Components/authPage/Register'));

function App() {
  return (
    // Add the basename prop to the Router
    <Router basename="/Health-Menta">
      <div className="text-[#1d4d85] app min-w-[280px] min-h-screen bg-background">
        <Header />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Make all Route paths relative to the basename */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicePage />} />
            <Route path="/about" element={<Landing />} />
            <Route path="/doctors" element={<DoctorsPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
