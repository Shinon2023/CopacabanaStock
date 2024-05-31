import "../../components/main.css";
import HistoryDatabox from "./history-databox";
import React, { useState, useEffect } from "react";
import Sidebar from "./sidebar";
import Calendar from "../../components/calendar";
import data from "./../../database/DataHistory/datefilter.json";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import "jspdf-autotable";

const History = () => {
  const [selectedCategory, setSelectedCategory] = useState("Latest");
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [reversedData, setReversedData] = useState([]);

  useEffect(() => {
    if (selectedCategory === "Time Period") {
      setIsCalendarOpen(true);
    }
  }, [selectedCategory]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  console.log(selectedCategory, isCalendarOpen);

  const getCurrentDateTime = () => {
    const now = new Date();
    const options = { timeZone: "Asia/Bangkok", hour12: false };
    const date = now.toLocaleDateString("en-GB", options).replace(/\//g, ":");
    const time = now.toLocaleTimeString("en-GB", options).replace(/:/g, ":");
    return { date, time };
  };

  const generateXlsx = () => {
    const { date, time } = getCurrentDateTime();
    const fileName = `stockdata(${date}-${time}).xlsx`;

    const filteredData = reversedData.map(({ imageUrl, ...rest }) => rest);
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Stock Data");
    XLSX.writeFile(workbook, fileName);
  };

  const generatePdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);

    const tableColumn = ["Name", "Amount", "Date", "Time", "Action", "By"];
    const tableRows = [];
    const { date, time } = getCurrentDateTime();
    const fileName = `stockdata(${date}-${time}).pdf`;

    reversedData.forEach((item) => {
      const itemData = [
        item.name,
        item.amount,
        item.date,
        item.time,
        item.action,
        item.user,
      ];
      tableRows.push(itemData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      theme: "grid",
    });

    doc.save(fileName);
  };

  return (
    <div className="flex">
      <Sidebar
        selectedCategory={selectedCategory}
        handleCategoryClick={handleCategoryClick}
        setIsCalendarOpen={setIsCalendarOpen}
      />
      <div className="flex-1 flex flex-col">
        <header className="p-4 bg-white shadow-md flex items-center justify-between">
          <h1 className="font-mono text-2xl mb-6">
            {selectedCategory === "Latest" ? (
              ""
            ) : (
              <>
                Time: {data.selectedDates[0]} - {data.selectedDates[1]}
              </>
            )}
          </h1>
          <div>
            <button
              onClick={generatePdf}
              className="px-4 py-2 bg-purple-500 text-white rounded ml-2"
            >
              Export to PDF
            </button>
            <button
              onClick={generateXlsx}
              className="px-4 py-2 bg-yellow-500 text-white rounded ml-2"
            >
              Export to XLSX
            </button>
          </div>
        </header>
        <main className="flex-1 p-4">
          <div className="bg-white p-6 rounded-lg h-full border-dashed border-2 border-gray-300 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <HistoryDatabox setReversedData={setReversedData} />
            {isCalendarOpen && selectedCategory === "Time Period-1" && (
              <Calendar onClose={() => setIsCalendarOpen(false)} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default History;
