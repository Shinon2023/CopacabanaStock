import React from "react";

const SpaceBox = () => {
  return (
    <div className="bg-white p-4 rounded-lg flex items-center space-x-4">
      <div className="w-40 h-40" />
      <div className="flex-1">
        <div className="font-bold"></div>
        <span className="text-xs px-2 py-1 rounded-full"></span>
        <div className="text-gray-500"></div>
      </div>
    </div>
  );
};

export default SpaceBox;
