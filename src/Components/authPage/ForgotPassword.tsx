import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  // State to manage which step of the process the user is on
  const [step, setStep] = useState<'request' | 'verify'>('request');
  
  // --- CHANGED: State now uses email instead of mobileNumber ---
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  // State for loading indicators and user feedback
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // --- Step 1: Handle the initial request to send an OTP ---
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      // --- CHANGED: Send email to the backend ---
      const response = await axios.post('http://localhost:3001/forgot-password', {
        email: email,
      });
      
      setSuccessMessage(response.data.message);
      setStep('verify'); // Move to the next step
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // --- Step 2: Handle the final submission to reset the password ---
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      // --- CHANGED: Send email to the backend ---
      const response = await axios.post('http://localhost:3001/reset-password', {
        email: email,
        otp: otp,
        newPassword: newPassword,
      });

      setSuccessMessage(response.data.message + " You can now log in with your new password.");
      // Optionally, you can redirect the user to the login page after a delay
      // setTimeout(() => { window.location.href = '/login'; }, 3000);

    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        
        {/* --- UI for Step 1: Requesting the OTP --- */}
        {step === 'request' && (
          <div>
            <h2 className="text-2xl font-bold text-center">Forgot Password</h2>
            <p className="text-center text-gray-600 mt-2">Enter your email address to receive an OTP.</p>
            <form onSubmit={handleRequestOtp} className="mt-8 space-y-6">
              <div>
                <label htmlFor="email" className="sr-only">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email" // Changed type to email
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter your email address"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
            </form>
          </div>
        )}

        {/* --- UI for Step 2: Verifying OTP and Resetting Password --- */}
        {step === 'verify' && (
           <div>
            <h2 className="text-2xl font-bold text-center">Reset Password</h2>
            <p className="text-center text-gray-600 mt-2">An OTP has been sent to {email}.</p>
            <form onSubmit={handleResetPassword} className="mt-8 space-y-6">
              <div>
                <label htmlFor="otp" className="sr-only">OTP</label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter 6-digit OTP"
                />
              </div>
               <div>
                <label htmlFor="newPassword" className="sr-only">New Password</label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter new password"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:bg-gray-400"
                disabled={loading}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          </div>
        )}

        {/* --- Display Messages for User Feedback --- */}
        {error && <p className="mt-4 text-center text-red-500">{error}</p>}
        {successMessage && <p className="mt-4 text-center text-green-500">{successMessage}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;
