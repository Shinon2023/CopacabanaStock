import React from 'react';
import Select from 'react-select';

const PickForm = ({ formData, filteredNames, handleInputChange, handleCloseForm, handleSubmit }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Pick Item</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <Select
              value={filteredNames.find((option) => option.value === formData.name) || null}
              onChange={(selectedOption) => handleInputChange({ target: { name: 'name', value: selectedOption.value } })}
              options={filteredNames}
              className="mb-2"
              name="name"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount || 0}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded-md w-full"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleCloseForm}
              className="p-2 bg-red-500 text-white rounded-md mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="p-2 bg-green-500 text-white rounded-md"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PickForm;
