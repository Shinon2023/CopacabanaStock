import React, { useState, useEffect } from "react";
import CreatableSelect from 'react-select/creatable';
import data from "./../../../database/DataStock/data-1.json"; // Adjust the path based on your project structure

const AddNewItemFormnew = ({ handleCloseForm }) => {
  const [formData, setFormData] = useState({
    name: "",
    amount: 0,
    category: "",
    image: null,
  });
  const [categories, setCategories] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const uniqueCategories = Array.from(
      new Set(data.map((item) => item.category))
    );
    const categoryOptions = uniqueCategories.map((category) => ({
      value: category,
      label: category,
    }));
    setCategories(categoryOptions);
  }, []);

  const isDuplicateName = (name) => {
    return data.some(item => item.name === name);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "name" && isDuplicateName(value)) {
      setErrorMessage("Name duplicates with, please change the name.");
    } else {
      setErrorMessage("");
    }
  };

  const handleCategoryChange = (selectedOption) => {
    setFormData({ ...formData, category: selectedOption ? selectedOption.value : '' });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formDataToSubmit = new FormData();
    formDataToSubmit.append("name", formData.name);
    formDataToSubmit.append("amount", formData.amount);
    formDataToSubmit.append("category", formData.category);
    formDataToSubmit.append("image", formData.image);

    try {
      const response = await fetch("http://localhost:5000/api/add-new-stock", {
        method: "POST",
        body: formDataToSubmit,
      });
      const result = await response.json();
      console.log("Add New Stock result:", result);
    } catch (error) {
      console.error("Failed to add new stock:", error);
    }
    handleCloseForm();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-md shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Add New Item</h2>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded-md w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              className="p-2 border border-gray-300 rounded-md w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Category</label>
            <CreatableSelect
              value={categories.find(option => option.value === formData.category) || null}
              onChange={handleCategoryChange}
              options={categories}
              className="mb-2"
              name="category"
              required
              formatCreateLabel={inputValue => `Add "${inputValue}"`}
              placeholder="Select or create a category"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Image</label>
            <input
              type="file"
              name="image"
              onChange={handleFileChange}
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
              disabled={!!errorMessage}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewItemFormnew;
