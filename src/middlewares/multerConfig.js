const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/img/");
  },
  filename: function (req, file, cb) {
    const name = req.body.name; // ใช้ชื่อไฟล์ตามชื่อที่รับเข้ามา
    const ext = path.extname(file.originalname);
    cb(null, name + ext);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
