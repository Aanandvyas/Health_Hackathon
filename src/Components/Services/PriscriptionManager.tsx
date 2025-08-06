import React, { useState } from 'react';
import axios from 'axios';
import { marked } from 'marked';

// A more engaging, reusable loading spinner component
const LoadingSpinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full text-center">
    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    <p className="mt-4 text-lg font-semibold text-gray-700">Analyzing Prescription...</p>
    <p className="mt-2 text-sm text-gray-500">This may take a few moments. Please wait.</p>
  </div>
);

const PrescriptionManager: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [medicineMarkdown, setMedicineMarkdown] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setMedicineMarkdown('');
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      setError('Please upload an image.');
      return;
    }
    setLoading(true);
    setError(null);
    setMedicineMarkdown('');

    const formData = new FormData();
    formData.append('image', image);
    formData.append('patient_id', 'UNKNOWN_PATIENT'); 
    formData.append('user_message', '');

    try {
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!validTypes.includes(image.type)) {
        setError('Please upload a valid image file (jpg, jpeg, png).');
        setLoading(false);
        return;
      }

      // --- API CALL WITH TIMEOUT ---
      // We've added a 30-second timeout (30000 milliseconds).
      const response = await axios.post(
        'http://127.0.0.1:5000/chat/sendMessage', // Ensure this URL is correct
        formData,
        {
          timeout: 30000, // 30-second timeout
        }
      );

      setMedicineMarkdown(response.data.bot_response);

    } catch (err: any) {
      if (axios.isCancel(err)) {
        setError('The request timed out. The server is taking too long to respond.');
      } else {
        const errorMessage = err.response?.data?.detail || 'Error uploading image or fetching data.';
        setError(errorMessage);
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gray-100 p-8 space-y-8 md:space-y-0">
      {/* Form Section */}
      <div className="w-full md:w-1/3 max-w-lg bg-white p-8 rounded-lg shadow-lg md:mr-8">
        <h1 className="text-4xl font-semibold mb-6 text-center">Prescription Manager</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="prescription" className="block text-xl font-medium text-gray-700 mb-3">
              Upload Prescription
            </label>
            <input
              type="file"
              id="prescription"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-4 border border-gray-300 rounded-md text-xl"
            />
          </div>
          <button
            type="submit"
            className="w-full py-4 bg-blue-500 text-white font-semibold rounded-md disabled:bg-gray-400 text-xl"
            disabled={loading}
          >
            {loading ? 'Analyzing...' : 'Submit Prescription'}
          </button>
        </form>
        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
      </div>

      {/* Medicine Info Section */}
      <div className="w-full md:w-2/3 max-w-2xl bg-white p-8 rounded-lg shadow-lg overflow-y-auto h-[70vh]">
        <h3 className="text-3xl font-semibold mb-6 text-center">
          {loading ? 'Analysis in Progress' : medicineMarkdown ? 'Medicine Information' : 'Please upload a prescription'}
        </h3>
        
        {loading ? (
          <LoadingSpinner />
        ) : medicineMarkdown ? (
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: marked(medicineMarkdown) }}
          />
        ) : (
          <p className="text-center text-lg text-gray-500">
            Upload a prescription image to get detailed information about the medicine.
          </p>
        )}
      </div>
    </div>
  );
};

export default PrescriptionManager;
