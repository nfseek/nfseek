import React from 'react';

export const ChartContainer = ({ children, className }) => {
  return (
    <div className={`relative ${className}`}>
      {children}
    </div>
  );
}; 