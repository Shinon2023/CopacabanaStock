import React from "react";

const Header = ({
  searchQuery,
  handleSearchChange,
  handlePickedButtonClick,
  handleAddedButtonClick,
  handleDeleteButtonClick,
  generatePdf,
  generateXlsx,
  access,
}) => {
  console.log(access)
  return (
    <header className="p-4 bg-white shadow-md flex items-center justify-between">
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search..."
        className="px-4 py-2 border rounded"
      />
      <div>
        {access !== "viewers" && (
          <>
            <button
              onClick={handlePickedButtonClick}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Pick
            </button>
            <button
              onClick={handleAddedButtonClick}
              className="px-4 py-2 bg-blue-500 text-white rounded ml-2"
            >
              Add
            </button>
            <button
              onClick={handleDeleteButtonClick}
              className="px-4 py-2 bg-red-500 text-white rounded ml-2"
            >
              Delete
            </button>
          </>
        )}
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
  );
};

export default Header;
