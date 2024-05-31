import React, { useEffect, useState, useMemo } from "react";
import DataBox from "./databox-history";
import SpaceBox from "../Stock/UI/SpaceBox";
import data from "./../../database/DataHistory/data.json";
import dateFilter from "./../../database/DataHistory/datefilter.json";

function filterDataByDate(data, startDate, endDate) {
  if (typeof startDate !== "string" || typeof endDate !== "string") {
    return data;
  }
  const start = new Date(startDate.split("/").reverse().join("/"));
  const end = new Date(endDate.split("/").reverse().join("/"));
  return data.filter((item) => {
    const itemDate = new Date(item.date.split("/").reverse().join("/"));
    return itemDate >= start && itemDate <= end;
  });
}

const HistoryDatabox = ({ setReversedData }) => {
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const [startDate, endDate] = dateFilter.selectedDates;
    if (startDate === 0 && endDate === 0) {
      setFilteredData(data);
    } else {
      const filtered = filterDataByDate(data, startDate, endDate);
      setFilteredData(filtered);
    }
  }, []);

  const reversedData = useMemo(() => [...filteredData].reverse(), [filteredData]);
  const numberOfSpaceBoxes = Math.max(0, 12 - reversedData.length);

  useEffect(() => {
    setReversedData(reversedData);
  }, [setReversedData, reversedData]);

  return (
    <>
      {reversedData.map((item, index) => (
        <DataBox key={index} data={item} />
      ))}
      {Array.from({ length: numberOfSpaceBoxes }).map((_, index) => (
        <SpaceBox key={`spacebox-${index}`} />
      ))}
    </>
  );
};

export default HistoryDatabox;
