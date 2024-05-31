import React from "react";

const DataboxStock = ({ data }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex items-center space-x-4">
      <img src={data.imageUrl} alt={data.name} className="w-40 h-40" />
      <div className="flex-1">
        <div className="font-bold">{data.name}</div>
        <span
          className={`bg-${data.amount > 0 ? "green" : "red"}-100 text-${
            data.amount > 0 ? "green" : "red"
          }-800 text-xs px-2 py-1 rounded-full`}
        >
          {data.status}
        </span>
        <div className="text-gray-500">
          {data.status}: {data.amount}
        </div>
      </div>
    </div>
  );
};

export default DataboxStock;
