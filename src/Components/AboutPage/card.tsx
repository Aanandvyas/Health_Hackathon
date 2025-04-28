import React, { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

type CardContentProps = {
  children: ReactNode;
};

const Card: React.FC<CardProps> = ({ children, className = "" }) => {
  return (
    <div className={`bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ${className}`}>
      {children}
    </div>
  );
};

export const CardContent: React.FC<CardContentProps> = ({ children }) => {
  return <div className="p-4">{children}</div>;
};

export default Card;
