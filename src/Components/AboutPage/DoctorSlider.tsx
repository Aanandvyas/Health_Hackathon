import { useState } from "react";
import { IoArrowBack, IoArrowForward } from "react-icons/io5";

import doctorsData from "./faqData";

const DoctorSlider = () => {
  const [slide, setSlide] = useState(0);

  function handleSlide(direction: string) {
    if (direction === "right" && slide !== -1800) {
      setSlide((prev) => prev - 600);
    } else if (direction === "left" && slide !== 0) {
      setSlide((prev) => prev + 600);
    } else {
      null;
    }
  }

  const slideStyle = {
    transform: `translateX(${slide}px)`,
  };

  return (
    <div className="max-w-full">
      {/* Slider Body */}
      <div
        className="flex gap-4 ease-in-out duration-300 overflow-x-scroll no-scrollbar sm:gap-x-8 md:overflow-x-visible"
        style={slideStyle}
      >
        {doctorsData.map((doctor) => {
          return (
            <div
              key={doctor.id}
              className="mb-8 p-2 flex flex-col gap-y-2 bg-purple-100 text-center text-purple-900 rounded-2xl"
            >
              
              <h3 className="text-2xl font-bold">Dr. Sudeshna Sinha</h3>
              <p className="mb-4">MBBS, MD (Rheumatologist)</p>
            </div>
          );
        })}
      </div>

      {/* Slider Controls) */}
      <div className="hidden md:flex w-full flex-col items-center justify-between gap-y-4 lg:flex-row">
        <div className="w-full lg:basis-1/3 flex items-center gap-x-2 [&>*]:h-2 [&>*]:basis-1/3">
          <div
            className={`${slide === 0 ? "bg-purple-900" : "bg-gray-200"}`}
          ></div>
          <div
            className={`${slide === -600 ? "bg-purple-900" : "bg-gray-200"}`}
          ></div>
          <div
            className={`${slide === -1200 ? "bg-purple-900" : "bg-gray-200"}`}
          ></div>
          <div
            className={`${slide === -1800 ? "bg-purple-900" : "bg-gray-200"}`}
          ></div>
        </div>

        <div className="flex gap-x-4 [&>*]:text-4xl">
          <button onClick={() => handleSlide("left")}>
            <IoArrowBack />
          </button>
          <button onClick={() => handleSlide("right")}>
            <IoArrowForward />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorSlider;