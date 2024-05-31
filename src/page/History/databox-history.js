import React from "react";

const DataboxHistory = ({ data }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4">
      <img src={data.imageUrl} alt={data.name} className="w-40 h-40" />
      <div className="flex-1">
        <div className="font-bold">{data.name}</div>
        <span
          className={`bg-${
            data.action === "Added" ? "green" : "red"
          }-100 text-${
            data.action === "Added" ? "green" : "red"
          }-800 text-xs px-2 py-1 rounded-full`}
        >
          {data.action}
        </span>
        <div className="text-gray-500">{data.category}</div>
        {data.action !== "Delete" && (
          <div className="text-gray-500">
            {data.action}: {data.amount}
          </div>
        )}
        <div className="text-gray-500">Date: {data.date}</div>
        <div className="text-gray-500">Time: {data.time}</div>
        <div className="text-gray-500">By: {data.user}</div>
      </div>
    </div>
  );
};

export default DataboxHistory;
