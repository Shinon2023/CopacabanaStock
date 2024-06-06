import React, { useState, useEffect } from "react";
import AllStock from "./Category/all";
import AddForm from "./Forms/AddForm";
import AddchoiceCategory from "./UI/AddchoiceCategory";
import AddNewItemForm from "./Forms/AddnewitemForm";
import DeleteForm from "./Forms/DeleteForm";
import PickForm from "./Forms/PickForm";
import Addchoice from "./UI/Addchoice";
import AddNewItemFormnew from "./Forms/AddnewitemForm_new";
import Header from "./UI/Header";
import Sidebar from "./UI/Sidebar";
import { getAllStockData } from "./Category/all";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import "../../components/main.css";
import "../../components/tailwind.css";

const Stock = () => {
  const [reversedData, setReversedData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleForm, setVisibleForm] = useState(null);
  const [showNewStockButtons, setShowNewStockButtons] = useState(false);
  const [showDeleteButton, setShowDeleteButton] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    amount: 0,
    image: null,
  });

  useEffect(() => {
    const initialData = getAllStockData(searchQuery, selectedCategory);
    if (initialData.length > 0) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        ...initialData[0],
      }));
    }
  }, [searchQuery, selectedCategory]);

  const handleCategoryClick = (category) => setSelectedCategory(category);
  const handleSearchChange = (event) => setSearchQuery(event.target.value);
  const handleDeleteButtonClick = () => setShowDeleteButton(true);
  const handleAddedButtonClick = () => {
    setShowNewStockButtons(true);
    setVisibleForm("Addchoice");
  };

  const handleFormVisibility = (formName) => {
    setVisibleForm(formName);
    setShowNewStockButtons(false);
  };

  const handleCloseForm = () => {
    setVisibleForm(null);
    setShowNewStockButtons(false);
    setShowDeleteButton(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (url, body, method = "POST") => {
    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const result = await response.json();
      console.log("Submit result:", result);
    } catch (error) {
      console.error("Failed to submit:", error);
    }
    handleCloseForm();
  };

  const filteredNames = getAllStockData(searchQuery, selectedCategory)
    .filter(
      (item) =>
        (item.name &&
          typeof item.name === "string" &&
          item.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.date &&
          typeof item.date === "string" &&
          item.date.includes(searchQuery))
    )
    .map((item) => ({ value: item.name, label: item.name }));
  console.log(filteredNames);

  const generatePdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);

    const tableColumn = ["Name", "Amount", "status", "category"];
    const tableRows = [];

    reversedData.forEach((item) => {
      const itemData = [item.name, item.amount, item.status, item.category];
      tableRows.push(itemData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      theme: "grid",
    });

    doc.save("history_data.pdf");
  };

  const generateXlsx = () => {
    // Ensure the correct order of columns
    const filteredData = reversedData.map(({ imageUrl, ...rest }) => ({
      "#": rest["#"],
      "name": rest["name"],
      "amount": rest["amount"],
      "status": rest["status"],
      "category": rest["category"],
      "date": rest["date"]
    }));

    // Create the worksheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Stock Data");

    // Write the workbook to file
    XLSX.writeFile(workbook, "stock_data.xlsx");
  };

  return (
    <>
      <div
        className={`flex ${
          visibleForm || showNewStockButtons || showDeleteButton
            ? "blur-sm"
            : ""
        }`}
      >
        <Sidebar
          selectedCategory={selectedCategory}
          handleCategoryClick={handleCategoryClick}
        />
        <div className="flex-1 flex flex-col">
          <Header
            searchQuery={searchQuery}
            handleSearchChange={handleSearchChange}
            handlePickedButtonClick={() => handleFormVisibility("PickForm")}
            handleAddedButtonClick={handleAddedButtonClick}
            handleDeleteButtonClick={handleDeleteButtonClick}
            generatePdf={generatePdf} // Pass generatePdf to Header
            generateXlsx={generateXlsx} // Pass generateXlsx to Header
          />
          <main className="flex-1 p-4">
            <div className="bg-white p-6 rounded-lg h-full border-dashed border-2 border-gray-300 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AllStock
                category={searchQuery}
                selectedCategory={selectedCategory}
                setReversedData={setReversedData} // Set reversed data
              />
            </div>
          </main>
        </div>
      </div>

      {visibleForm === "Addchoice" && (
        <Addchoice
          handleAddNewStockClick={() =>
            handleFormVisibility("AddchoiceCategory")
          }
          handleAddExistingStockClick={() => handleFormVisibility("AddForm")}
          handleCloseForm={handleCloseForm}
        />
      )}

      {visibleForm === "AddchoiceCategory" && (
        <AddchoiceCategory
          handleAddNewCategoryClick={() =>
            handleFormVisibility("AddNewItemFormNew")
          }
          handleAddExistingCategoryClick={() =>
            handleFormVisibility("AddNewItemForm")
          }
          handleCloseForm={handleCloseForm}
        />
      )}

      {visibleForm === "AddForm" && (
        <AddForm
          formData={formData}
          filteredNames={filteredNames}
          handleInputChange={handleInputChange}
          handleCloseForm={handleCloseForm}
          handleSubmit={(e) => {
            e.preventDefault();
            handleSubmit("http://copacabanastock.com:5000/api/update-stock", {
              name: formData.name,
              amount: parseFloat(formData.amount),
            });
          }}
        />
      )}

      {visibleForm === "AddNewItemForm" && (
        <AddNewItemFormnew
          formData={formData}
          handleInputChange={handleInputChange}
          handleFileChange={handleFileChange}
          handleCloseForm={handleCloseForm}
          handleSubmit={(e) => {
            e.preventDefault();
            const formDataToSubmit = new FormData();
            formDataToSubmit.append("name", formData.name);
            formDataToSubmit.append("amount", formData.amount);
            formDataToSubmit.append("image", formData.image);
            handleSubmit(
              "http://copacabanastock.com:5000/api/add-new-stock",
              formDataToSubmit
            );
          }}
        />
      )}

      {visibleForm === "AddNewItemFormNew" && (
        <AddNewItemForm
          formData={formData}
          handleInputChange={handleInputChange}
          handleFileChange={handleFileChange}
          handleCloseForm={handleCloseForm}
          handleSubmit={(e) => {
            e.preventDefault();
            const formDataToSubmit = new FormData();
            formDataToSubmit.append("name", formData.name);
            formDataToSubmit.append("amount", formData.amount);
            formDataToSubmit.append("image", formData.image);
            handleSubmit(
              "http://copacabanastock.com:5000/api/add-new-stock",
              formDataToSubmit
            );
          }}
        />
      )}

      {visibleForm === "PickForm" && (
        <PickForm
          formData={formData}
          filteredNames={filteredNames}
          handleInputChange={handleInputChange}
          handleCloseForm={handleCloseForm}
          handleSubmit={(e) => {
            e.preventDefault();
            handleSubmit("http://copacabanastock.com:5000/api/pick-stock", {
              name: formData.name,
              amount: parseFloat(formData.amount),
            });
          }}
        />
      )}

      {showDeleteButton && (
        <DeleteForm
          formData={formData}
          filteredNames={filteredNames}
          handleInputChange={handleInputChange}
          handleCloseForm={handleCloseForm}
          handleSubmit={(e) => {
            e.preventDefault();
            handleSubmit("http://copacabanastock.com:5000/api/delete-stock", {
              name: formData.name,
            });
          }}
        />
      )}
    </>
  );
};

export default Stock;
