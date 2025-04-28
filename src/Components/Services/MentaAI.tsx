import React, { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';

const MentaAI: React.FC = () => {
  const [messages, setMessages] = useState<{ user: string; text: string; timestamp: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [patientId, setPatientId] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null); 
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchPatientId = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');
  
        const response = await fetch('http://localhost:3001/api/getPatientId', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) {
          console.error("Failed to fetch patient ID:", response);
          throw new Error('Failed to fetch patient ID');
        }
  
        const data = await response.json();
        console.log("Patient Data:", data);  // Log response data
        setPatientId(data.patientId);
      } catch (error) {
        console.error('Error fetching patient ID:', error);
      }
    };
  
    fetchPatientId();
  }, []);

  const handleSend = async () => {
    if (!input.trim() && !image) {
      console.warn('Cannot send an empty message.');
      return;
    }
    if (!patientId) {
      alert('Patient ID is not available. Please wait until it is fetched.');
      return;
    }

    const timestamp = new Date().toLocaleTimeString();
    setMessages((prev) => [...prev, { user: 'You', text: input || '[Image Sent]', timestamp }]);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("patient_id", patientId);
      formData.append("user_message", input);

      // If an image is selected, append it to the FormData
      if (image) {
        formData.append("image", image, image.name);  // Send file as it is
      }

      const response = await fetch('http://localhost:8000/chat/uploadImage', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Error connecting to chat server');

      const data = await response.json();
      setMessages((prevMessages) => [
        ...prevMessages,
        { user: 'MentaAI', text: data.bot_response || 'No response from AI', timestamp: new Date().toLocaleTimeString() },
      ]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { user: 'MentaAI', text: 'Error connecting to the server.', timestamp: new Date().toLocaleTimeString() },
      ]);
    }

    setLoading(false);
    setInput('');
    setImage(null);  // Reset the image after sending
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);  // Store the file directly in state
    }
  };

  return (
    <div className="flex flex-col h-screen p-4 bg-gray-100 overflow-hidden">
      <div className="flex-none p-4 bg-green-500 text-white rounded-t-lg flex items-center justify-between">
        <h2 className="text-xl font-bold">MentaAI Chat</h2>
      </div>
      <div className="flex-1 p-4 bg-white rounded-b-lg shadow-md overflow-auto">
        {messages.map((message, index) => (
          <div key={index} className={`mb-3 p-3 rounded-lg ${message.user === 'You' ? 'bg-green-100 self-end' : 'bg-gray-200 self-start'}`}>
            <strong>{message.user}:</strong>
            <span className="text-xs text-gray-500"> {message.timestamp}</span>
            <div dangerouslySetInnerHTML={{ __html: marked(message.text || "No response generated") }} />
          </div>
        ))}
        {loading && <p className="text-gray-500 italic">MentaAI is typing...</p>}
      </div>

      {/* Preview of the uploaded image */}
      {image && <img src={URL.createObjectURL(image)} alt="Captured" className="w-28 h-28 mx-auto mt-2 rounded-md shadow-lg" />}

      <div className="flex-none mt-4">
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-l-lg"
          />
          <button onClick={() => fileInputRef.current?.click()} className="p-2 bg-blue-500 text-white">📷</button>
          <button onClick={handleSend} className="p-2 bg-green-500 text-white rounded-r-lg" disabled={loading}>
            {loading ? 'Sending...' : 'Send'}
          </button>
        </div>
        <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" hidden />
      </div>
    </div>
  );
};

export default MentaAI;
