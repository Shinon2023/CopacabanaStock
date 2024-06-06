const fs = require("fs");

const readFileAsync = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
};

const writeFileAsync = (filePath, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

const renameFileAsync = (oldPath, newPath) => {
  return new Promise((resolve, reject) => {
    fs.rename(oldPath, newPath, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

const getCurrentDateTime = () => {
  const now = new Date();
  const options = { timeZone: "Asia/Bangkok", hour12: false };
  const date = now.toLocaleDateString("en-GB", options);
  const time = now.toLocaleTimeString("en-GB", options);
  return { date, time };
};

module.exports = { readFileAsync, writeFileAsync, renameFileAsync, getCurrentDateTime };
