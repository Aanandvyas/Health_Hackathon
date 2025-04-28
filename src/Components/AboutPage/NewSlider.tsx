import { useState } from "react";
import { IoArrowBack, IoArrowForward } from "react-icons/io5";

import newsData from "./NewsData";

const NewsSlider = () => {
  const [slide, setSlide] = useState(0);

  function handleSlide(direction: string) {
    if (direction === "right" && slide !== -6000) {
      setSlide((prev) => prev - 1500);
    } else if (direction === "left" && slide !== 0) {
      setSlide((prev) => prev + 1500);
    }
  }

  const slideStyle = {
    transform: `translateX(${slide}px)`,
  };

  return (
    <div className="max-w-full">
      {/* Slider Body */}
      <div
        className="flex gap-8 ease-in-out duration-300 overflow-x-scroll no-scrollbar sm:gap-x-12 md:overflow-x-auto"
        style={slideStyle}
      >
        {newsData.map((news) => {
          return (
            <div
              key={news.id}
              className="mb-8 p-8 flex flex-col gap-y-6 bg-purple-100 text-purple-900 rounded-2xl shadow-lg sm:p-10 sm:w-[600px] lg:w-[800px]"
            >
              <img
                src={news.url}
                alt="News image"
                className="w-full h-[300px] object-cover object-center rounded-2xl sm:h-[350px] lg:h-[400px]"
              />
              <p className="font-semibold text-lg">
                {news.date} • By {news.author}
              </p>
              <h3 className="mb-4 text-3xl font-bold">{news.title}</h3>
              <a
                href="#"
                className="text-2xl font-bold text-teal-500 md:hover:text-teal-400"
              >
                Read More
              </a>
            </div>
          );
        })}
      </div>

      {/* Slider Controls */}
      <div className="hidden md:flex w-full flex-col items-center justify-between gap-y-4 lg:flex-row">
        <div className="w-full lg:basis-1/3 flex items-center gap-x-2 [&>*]:h-2 [&>*]:basis-1/3">
          <div
            className={`${slide === 0 ? "bg-purple-900" : "bg-gray-200"}`}
          ></div>
          <div
            className={`${slide === -1500 ? "bg-purple-900" : "bg-gray-200"}`}
          ></div>
          <div
            className={`${slide === -3000 ? "bg-purple-900" : "bg-gray-200"}`}
          ></div>
          <div
            className={`${slide === -4500 ? "bg-purple-900" : "bg-gray-200"}`}
          ></div>
          <div
            className={`${slide === -6000 ? "bg-purple-900" : "bg-gray-200"}`}
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

export default NewsSlider;
