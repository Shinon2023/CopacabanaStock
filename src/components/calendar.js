// src/Calendar.js
import React, { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
} from "date-fns";

const Calendar = ({ onClose }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState([]);
  console.log(selectedDates);

  const renderHeader = () => {
    return (
      <div className="flex justify-between items-center py-2 px-4 bg-gray-100">
        <div>
          <span className="text-lg font-bold">
            {format(currentMonth, "MMMM yyyy")}
          </span>
        </div>
        <div>
          <button onClick={prevMonth} className="px-2 py-1 bg-gray-300 rounded">
            Prev
          </button>
          <button
            onClick={nextMonth}
            className="px-2 py-1 bg-gray-300 rounded ml-2"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const startDate = startOfWeek(currentMonth);

    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="text-center text-sm py-2">
          {format(addDays(startDate, i), "EEEE")}
        </div>
      );
    }

    return <div className="grid grid-cols-7">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "d");
        const cloneDay = day;
        const formattedCloneDay = format(cloneDay, "dd/MM/yyyy");
        days.push(
          <div
            key={day}
            className={`py-2 text-center ${
              !isSameMonth(day, monthStart)
                ? "text-gray-400"
                : selectedDates.includes(formattedCloneDay)
                ? "bg-blue-500 text-white"
                : "text-black"
            }`}
            onClick={() => onDateClick(formattedCloneDay)}
          >
            <span>{formattedDate}</span>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day} className="grid grid-cols-7">
          {days}
        </div>
      );
      days = [];
    }
    return <div>{rows}</div>;
  };

  const onDateClick = (day) => {
    if (selectedDates.length === 0 || selectedDates.length === 2) {
      setSelectedDates([day]);
    } else if (selectedDates.length === 1) {
      setSelectedDates([...selectedDates, day]);
    }
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const sendSelectedDates = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/filter-datahistory",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ selectedDates }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Network response was not ok: ${errorText}`);
      }

      const result = await response.json();
      console.log("Success:", result);
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const sendSelectedDatesAndClose = async () => {
    await sendSelectedDates();
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Calendar</h2>
          <button
            onClick={onClose}
            className="px-2 py-1 bg-red-500 text-white rounded"
          >
            Close
          </button>
        </div>
        <div className="w-full h-full bg-white shadow-md rounded-lg overflow-hidden">
          {renderHeader()}
          {renderDays()}
          {renderCells()}
          <div className="p-4">
            {selectedDates.map((date) => (
              <div key={date}>Selected Date: {date}</div>
            ))}
          </div>
          <div className="p-4">
            <button
              onClick={sendSelectedDatesAndClose}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Send Selected Dates
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
