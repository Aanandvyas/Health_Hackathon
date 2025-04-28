import { useState } from "react";
import MentaAI from "./MentaAI";
import Dashboard from "./Dashboard";
import PriscriptionManager from "./PriscriptionManager";
import HealthCenters from "./healthcenters";

const ServicePage = () => {
  const [activeComponent, setActiveComponent] = useState("dashboard");

  // Function to render the active component dynamically
  const renderComponent = () => {
    switch (activeComponent) {
      case "dashboard":
        return <Dashboard />;
      case "healthmenta":
        return <MentaAI />;
      case "prescription":
        return <PriscriptionManager />; 
      case "centers":
        return <HealthCenters/>; 
      default:
        return <div>Select a service to display</div>;
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full overflow-hidden">
      <div className="h-16 w-full ">
        {/* Add a header or space here */}
      </div>
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar for navigation */}
        <nav className="w-1/5 flex-shrink-0 bg-white p-4">
          <h2 className="text-lg lg:text-3xl font-bold flex items-center justify-center my-4">
            Services
          </h2>
          <ul className="flex flex-col gap-4 text-xs md:text-lg">
            <li className="flex items-center">
              <img
                className="w-0 md:w-12 md:h-12 md:mr-4"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjrpsryruSpqhLVKB0kYYFEFciwSXPkn-XDA&s"
                alt="HealthMentá.ai"
              />
              <button
                className="hover:text-blue-500"
                onClick={() => setActiveComponent("healthmenta")}
              >
                HealthMentá.ai
              </button>
            </li>
            <li className="flex items-center">
              <img
                className="w-0 md:w-12 md:h-12 md:mr-4"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjrpsryruSpqhLVKB0kYYFEFciwSXPkn-XDA&s"
                alt="Prescription Manager"
              />
              <button
                className="hover:text-blue-500"
                onClick={() => setActiveComponent("prescription")}
              >
                Prescription Manager
              </button>
            </li>
            <li className="flex items-center">
              <img
                className="w-0 md:w-12 md:h-12 md:mr-4"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjrpsryruSpqhLVKB0kYYFEFciwSXPkn-XDA&s"
                alt="Health Centers"
              />
              <button
                className="hover:text-blue-500"
                onClick={() => setActiveComponent("centers")}
              >
                Health Centers
              </button>
            </li>
            <li className="flex items-center">
              <img
                className="w-0 md:w-12 md:h-12 md:mr-4"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjrpsryruSpqhLVKB0kYYFEFciwSXPkn-XDA&s"
                alt="Dashboard"
              />
              <button
                className="hover:text-blue-500"
                onClick={() => setActiveComponent("dashboard")}
              >
                Dashboard
              </button>
            </li>
          </ul>
        </nav>

        {/* Main content area */}
        <div className="flex-auto w-4/5 p-4">
          {renderComponent()}
        </div>
      </div>
    </div>
  );
};

export default ServicePage;
