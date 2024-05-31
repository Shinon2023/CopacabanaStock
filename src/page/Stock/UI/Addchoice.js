import React from 'react';

const Addchoice = ({ handleAddNewStockClick, handleAddExistingStockClick, handleCloseForm }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Add Item</h2>
        <div className="flex justify-around">
          <button
            onClick={handleAddNewStockClick}
            className="p-2 bg-green-500 text-white rounded-md m-3"
          >
            Add New Stock
          </button>
          <button
            onClick={handleAddExistingStockClick}
            className="p-2 bg-blue-500 text-white rounded-md m-3"
          >
            Add Existing Stock
          </button>
        </div>
        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={handleCloseForm}
            className="p-2 bg-red-500 text-white rounded-md me-3"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Addchoice;
