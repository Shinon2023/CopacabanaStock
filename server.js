const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const stockRoutes = require("./src/routes/stockRoutes");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use("/api", stockRoutes);
app.use("/api", stockRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
