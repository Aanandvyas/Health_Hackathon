import React from "react";

interface InfoCardProps {
  name: string;
  rating: number;
  address: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ name, rating, address }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-5">
      <h3 className="text-xl font-bold">{name}</h3>
      <div className="flex items-center">
        {Array.from({ length: 5 }).map((_, index) => (
          <span key={index} className={index < rating ? "text-yellow-500" : "text-gray-300"}>
            ★
          </span>
        ))}
        <span className="ml-2 text-gray-600">({rating}.0)</span>
      </div>
      <p className="text-gray-700">{address}</p>
      <p className="text-green-600 font-semibold">Open 24 Hours</p>
      <div className="flex justify-between mt-3">
        <button className="bg-green-500 text-white px-4 py-2 rounded-lg">Call</button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">Directions</button>
      </div>
    </div>
  );
};

export default InfoCard;
