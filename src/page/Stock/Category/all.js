import React, { useEffect, useMemo } from "react";
import DataboxStock from "../UI/databox-stock";
import SpaceBox from "../UI/SpaceBox";
import data from "./../../../database/DataStock/data-1.json";

export function getAllStockData(searchQuery, selectedCategory) {
  let allstockdata = [];

  if (selectedCategory === "All") {
    allstockdata = data.filter((item) => {
      return (
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.date.includes(searchQuery)
      );
    });
  } else {
    allstockdata = data.filter((item) => {
      return (
        item.category === selectedCategory &&
        (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.date.includes(searchQuery))
      );
    });
  }
  return allstockdata;
}

function AllStock({ category, selectedCategory, setReversedData }) {
  const allstockdata = useMemo(() => getAllStockData(category, selectedCategory), [category, selectedCategory]);
  const numberOfSpaceBoxes = Math.max(0, 12 - allstockdata.length);

  useEffect(() => {
    setReversedData(allstockdata);
  }, [allstockdata, setReversedData]);

  return (
    <>
      {allstockdata.map((item, index) => (
        <DataboxStock key={index} data={item} />
      ))}
      {Array.from({ length: numberOfSpaceBoxes }).map((_, index) => (
        <SpaceBox key={`spacebox-${index}`} />
      ))}
    </>
  );
}

export default AllStock;
