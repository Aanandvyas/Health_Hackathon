import React, { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';

const MentaAI: React.FC = () => {
  const [messages, setMessages] = useState<{ user: string; text: string; timestamp: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [patientId, setPatientId] = useState<string | null>(null);
  const [image, setImage] = useState<File | null>(null); 
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Ref to help auto-scroll to the latest message
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Function to scroll to the bottom of the messages container
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Auto-scroll whenever a new message is added
  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

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

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [...prev, { user: 'You', text: input || '[Image Sent]', timestamp }]);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("patient_id", patientId);
      formData.append("user_message", input);

      if (image) {
        formData.append("image", image, image.name);
      }

      const response = await fetch('http://localhost:8000/chat/uploadImage', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Error connecting to chat server');

      const data = await response.json();
      setMessages((prevMessages) => [
        ...prevMessages,
        { user: 'MentaAI', text: data.bot_response || 'No response from AI', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      ]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { user: 'MentaAI', text: 'Error connecting to the server.', timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      ]);
    }

    setLoading(false);
    setInput('');
    setImage(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
    }
  };

  return (
    // Main container uses flex-col and h-screen to define the overall structure
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header: Stays fixed at the top */}
      <div className="flex-shrink-0 p-4 bg-green-500 text-white rounded-t-lg flex items-center justify-between">
        <h2 className="text-xl font-bold">MentaAI Chat</h2>
      </div>

      {/* Messages Area: Takes up all available space and scrolls internally */}
      <div className="flex-grow p-4 overflow-y-auto bg-white">
        {messages.map((message, index) => (
          <div key={index} className={`mb-3 p-3 rounded-lg max-w-lg ${message.user === 'You' ? 'bg-green-100 ml-auto' : 'bg-gray-200 mr-auto'}`}>
            <div className="flex items-baseline justify-between">
                <strong className="text-sm">{message.user}:</strong>
                <span className="text-xs text-gray-500 ml-2">{message.timestamp}</span>
            </div>
            <div className="prose prose-sm mt-1" dangerouslySetInnerHTML={{ __html: marked(message.text || "No response generated") }} />
          </div>
        ))}
        {loading && <p className="text-gray-500 italic">MentaAI is typing...</p>}
        {/* Empty div at the end to help with auto-scrolling */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area: Stays fixed at the bottom */}
      <div className="flex-shrink-0 p-3 bg-white border-t border-gray-200">
        {image && (
          <div className="relative w-24 h-24 mb-2">
            <img src={URL.createObjectURL(image)} alt="Preview" className="w-full h-full object-cover rounded-md" />
            <button onClick={() => setImage(null)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs -mt-2 -mr-2">
              &times;
            </button>
          </div>
        )}
        <div className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button onClick={() => fileInputRef.current?.click()} className="p-2 border-t border-b bg-gray-200 hover:bg-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l-1.586-1.586a2 2 0 00-2.828 0L6 16" /></svg>
          </button>
          <button onClick={handleSend} className="p-2 bg-green-500 text-white rounded-r-lg hover:bg-green-600 disabled:bg-gray-400" disabled={loading || (!input.trim() && !image)}>
            {loading ? '...' : 'Send'}
          </button>
        </div>
        <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" hidden />
      </div>
    </div>
  );
};

export default MentaAI;
