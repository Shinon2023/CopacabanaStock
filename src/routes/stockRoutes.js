const express = require("express");
const path = require("path");
const upload = require("../middlewares/multerConfig");
const {
  readFileAsync,
  writeFileAsync,
  renameFileAsyncrenameFileAsyncrenameFileAsync
  getCurrentDateTime,
} = require("../utils/fileUtils");

const router = express.Router();
const filePaths = [
  path.join(__dirname, "./../database/DataStock/data-1.json"),
  path.join(__dirname, "./../database/DataHistory/data.json"),
  path.join(__dirname, "./../database/DataUsers/user-state.json"),
];

router.post("/add-new-stock", upload.single("image"), async (req, res) => {
  const { name, amount, category } = req.body;
  const image = req.file ? req.file.path : null;
  const newImagePath = path.join(
    __dirname,
    "../../public/img/",
    name + path.extname(req.file.originalname)
  );

  if (!name || !amount || !image || !category) {
    return res.status(400).json({ message: "Hello" });
  }

  try {
    const data1 = await readFileAsync(filePaths[0]);
    let stockData1 = JSON.parse(data1);
    const data3 = await readFileAsync(filePaths[2]);
    const userstate = JSON.parse(data3);
    const { date, time } = getCurrentDateTime();

    if (stockData1.find((item) => item.name === name)) {
      return res.status(400).json({ message: "Item already exists" });
    }

    const newItem = {
      "#": stockData1.length + 1,
      name,
      amount: parseFloat(amount),
      status: amount > 0 ? "In Stock" : "Out Stock",
      category,
      imageUrl: `./img/${name}${path.extname(req.file.originalname)}`,
      date,
    };

    stockData1.push(newItem);
    await writeFileAsync(filePaths[0], stockData1);
    await renameFileAsync(image, newImagePath);

    const newItemWithDateTime = {
      name,
      imageUrl: newItem.imageUrl,
      amount: newItem.amount,
      date,
      time,
      action: "Added",
      user: userstate[0]["name"],
    };

    const data2 = await readFileAsync(filePaths[1]);
    const stockData2 = JSON.parse(data2);
    stockData2.push(newItemWithDateTime);
    await writeFileAsync(filePaths[1], stockData2);

    res.json({ message: "Stock added successfully", item: newItem });
  } catch (err) {
    console.error("Error handling request:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/update-stock", async (req, res) => {
  const { name, amount } = req.body;
  try {
    const data1 = await readFileAsync(filePaths[0]);
    let stockData1 = JSON.parse(data1);
    const data3 = await readFileAsync(filePaths[2]);
    const userstate = JSON.parse(data3);
    const itemToUpdate = stockData1.find((item) => item.name === name);
    if (!itemToUpdate) {
      return res.status(404).json({ message: "Item not found" });
    }

    stockData1 = stockData1.map((item) => {
      if (item.name === name) {
        const currentAmount = parseFloat(item.amount);
        const newAmount = currentAmount + parseFloat(amount);
        return {
          ...item,
          amount: newAmount,
          status: newAmount > 0 ? "In Stock" : "Out Stock",
        };
      }
      return item;
    });
    await writeFileAsync(filePaths[0], stockData1);
    const { date, time } = getCurrentDateTime();
    const newItemWithDateTime = {
      name,
      imageUrl: itemToUpdate.imageUrl,
      amount: parseFloat(amount),
      date,
      time,
      action: "Added",
      user: userstate[0]["name"],
    };

    const data2 = await readFileAsync(filePaths[1]);
    const stockData2 = JSON.parse(data2);
    stockData2.push(newItemWithDateTime);
    await writeFileAsync(filePaths[1], stockData2);
    res.json({ message: "Stock updated successfully" });
  } catch (err) {
    console.error("Error handling request:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/delete-stock", async (req, res) => {
  const { name } = req.body;
  try {
    const data1 = await readFileAsync(filePaths[0]);
    let stockData1 = JSON.parse(data1);
    const data3 = await readFileAsync(filePaths[2]);
    const userstate = JSON.parse(data3);
    const itemToDelete = stockData1.find((item) => item.name === name);
    if (!itemToDelete) {
      return res.status(404).json({ message: "Item not found" });
    }
    const newStockData1 = stockData1.filter((item) => item.name !== name);
    await writeFileAsync(filePaths[0], newStockData1);

    const { date, time } = getCurrentDateTime();
    const newItemWithDateTime = {
      name,
      imageUrl: itemToDelete.imageUrl,
      amount: 0,
      date,
      time,
      action: "Deleted",
      user: userstate[0]["name"],
    };
    const data2 = await readFileAsync(filePaths[1]);
    const stockData2 = JSON.parse(data2);
    stockData2.push(newItemWithDateTime);
    await writeFileAsync(filePaths[1], stockData2);
    res.json({ message: "Stock deleted successfully" });
  } catch (err) {
    console.error("Error handling request:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/pick-stock", async (req, res) => {
  const { name, amount } = req.body;
  try {
    const data1 = await readFileAsync(filePaths[0]);
    let stockData1 = JSON.parse(data1);
    const data3 = await readFileAsync(filePaths[2]);
    const userstate = JSON.parse(data3);
    const itemToPick = stockData1.find((item) => item.name === name);
    if (!itemToPick) {
      return res.status(404).json({ message: "Item not found" });
    }
    stockData1 = stockData1.map((item) => {
      if (item.name === name) {
        const currentAmount = parseFloat(item.amount);
        const subAmount = parseFloat(amount);
        const newAmount = currentAmount - subAmount;
        return {
          ...item,
          amount: newAmount,
          status: newAmount > 0 ? "In Stock" : "Out Stock",
        };
      }
      return item;
    });
    await writeFileAsync(filePaths[0], stockData1);
    const { date, time } = getCurrentDateTime();
    const newItemWithDateTime = {
      name,
      imageUrl: itemToPick.imageUrl,
      amount: parseFloat(amount),
      date,
      time,
      action: "Picked",
      user: userstate[0]["name"],
    };
    const data2 = await readFileAsync(filePaths[1]);
    const stockData2 = JSON.parse(data2);
    stockData2.push(newItemWithDateTime);
    await writeFileAsync(filePaths[1], stockData2);
    res.json({ message: "Stock picked successfully" });
  } catch (err) {
    console.error("Error handling request:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/user-state", async (req, res) => {
  const { name, access } = req.body;
  try {
    console.log("Received request with name:", name);
    const data1Path = path.join(__dirname, "./../database/DataUsers/data.json");
    const data2Path = path.join(
      __dirname,
      "./../database/DataUsers/user-state.json"
    );
    console.log("Reading data from:", data1Path);
    const data1Content = await readFileAsync(data1Path);
    const data1 = JSON.parse(data1Content);
    console.log("Data from data.json:", data1);
    console.log("Searching for user with name:", name);
    const username = [
      {
        name: name,
        "access": access
      },
    ];
    await writeFileAsync(data2Path, username);

    console.log("User state updated successfully");
    res.json({ message: "Data updated successfully", data: name });
  } catch (error) {
    console.error("Error handling request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/filter-datahistory", async (req, res) => {
  const { selectedDates } = req.body;

  try {
    if (!Array.isArray(selectedDates) || selectedDates.length === 0) {
      console.error(
        "Invalid data format: selectedDates should be a non-empty array"
      );
      return res
        .status(400)
        .json({ message: "selectedDates should be a non-empty array" });
    }

    console.log("Received request with dates:", selectedDates);

    const dataFilePath = path.join(
      __dirname,
      "./../database/DataHistory/datefilter.json"
    );
    console.log("Reading data from:", dataFilePath);

    const dataFileContent = await readFileAsync(dataFilePath, "utf8");
    const data = JSON.parse(dataFileContent);
    console.log("Data from datefilter.json:", data);

    data.selectedDates = [];

    data.selectedDates.push(...selectedDates);

    await writeFileAsync(dataFilePath, data);
    console.log("Data updated successfully");

    res.json({ message: "Data updated successfully", data: selectedDates });
  } catch (error) {
    console.error("Error handling request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/fetch-datefilter-data", async (req, res) => {
  try {
    const dataFilePath = path.join(
      __dirname,
      "./../database/DataHistory/datefilter.json"
    );
    console.log("Reading data from:", dataFilePath);

    const dataFileContent = await readFileAsync(dataFilePath, "utf8");
    const data = JSON.parse(dataFileContent);
    console.log("Data from datefilter.json:", data);

    res.json({ message: "Data fetched successfully", data });
  } catch (error) {
    console.error("Error handling request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
