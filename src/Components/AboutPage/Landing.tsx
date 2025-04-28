import React from "react";
import { motion } from "framer-motion";
import Card, { CardContent } from "./card";
import { FaRobot, FaFileMedical, FaHospital, FaChartBar } from "react-icons/fa";
import "./about.css";

const features = [
  {
    icon: <FaRobot size={50} className="text-blue-500" />, 
    title: "AI Health Monitoring Chatbot", 
    description: "An intelligent chatbot that monitors your health and provides instant insights."
  },
  {
    icon: <FaFileMedical size={50} className="text-green-500" />, 
    title: "Prescription Analyzer", 
    description: "Upload prescriptions to get insights on medicine interactions and dosages."
  },
  {
    icon: <FaHospital size={50} className="text-red-500" />, 
    title: "Nearby Health Center Locator", 
    description: "Find the nearest hospitals, pharmacies, and clinics instantly."
  },
  {
    icon: <FaChartBar size={50} className="text-purple-500" />, 
    title: "Dashboard & Records", 
    description: "Maintain and visualize personal health records with ease."
  }
];

const About = () => {
  return (
    <div className="about-container p-10 text-center bg-gray-100 min-h-screen">
      <motion.h1 
        className="text-4xl font-bold text-gray-800 mb-6"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
       About Our Healthcare Platform
      </motion.h1>
      <p className="text-lg font-bold text-gray-800 max-w-2xl mx-auto mb-10">
        Our platform integrates AI-powered solutions to provide personalized healthcare assistance. 
        From monitoring your health to analyzing prescriptions and finding nearby medical centers, 
        we ensure a seamless experience for users.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
  {features.map((feature, index) => (
    <motion.div 
      key={index} 
      className="flex flex-col items-center h-full"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
    >
      <Card className="p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-white h-full">
        <CardContent>
          <div className="h-full flex flex-col justify-center">
          <div className="flex flex-col items-center">
            {feature.icon}
            <h2 className="text-xl font-semibold text-gray-800 mt-4">{feature.title}</h2>
            <p className="text-gray-600 mt-2 text-center">{feature.description}</p>
          </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  ))}
</div>

      <div className="text-left max-w-3xl mx-auto mb-10 mt-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Why These Features Matter</h2>
        <p className="text-gray-600 mb-4">
          Modern healthcare is often plagued by inefficiencies, misdiagnoses, and lack of access to proper medical guidance. 
          Our AI-driven platform aims to bridge these gaps by providing real-time health monitoring, prescription insights, 
          and instant access to healthcare facilities.
        </p>
        <div className="video-container mb-10">
        <iframe 
          className="w-full max-w-3xl h-64 md:h-96 mx-auto rounded-lg shadow-lg" 
          src="https://www.youtube.com/embed/uvqDTbusdUU?si=XXAZkMWlBZp7RUBg"
          title="Healthcare AI Overview" 
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen
        ></iframe>
      </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Problems We Solve</h2>
        <ul className="list-disc list-inside text-gray-600">
          <li><strong>Delayed Diagnosis:</strong> Our chatbot offers immediate health insights, reducing the time to diagnosis.</li>
          <li><strong>Prescription Confusion:</strong> The analyzer helps users understand their medications better.</li>
          <li><strong>Accessibility Issues:</strong> Our locator helps find the nearest health centers within seconds.</li>
          <li><strong>Disorganized Medical Records:</strong> A centralized dashboard ensures all records are well-organized and easily accessible.</li>
        </ul>
      </div>
      
    </div>
  );
};

export default About;
