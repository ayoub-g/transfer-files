const express = require("express");
const router = express.Router();
const multer = require("multer");
const { fileFilter } = require("./file-filter");
const { readFile } = require("fs/promises");
const path = require("path");

const storage = multer.diskStorage({
  destination: async (req, file, callBack) => {
    // read configuration file
    const config = (
      await readFile(path.join(__dirname, "config.json"))
    ).toString();

    // get keys values from config file
    const { volume, imagesPath, videosPath } = JSON.parse(config).storage;

    // set the destination folder for videos files
    if (file.mimetype === "video/mp4") {
      callBack(null, volume + videosPath);
      // set the destination folder for images files
    } else if (file.mimetype === "image/*") {
      callBack(null, volume + imagesPath);
    }
    // you can more file types here and uptate the input file tag in the client ui
  },

  // configure file name
  filename: (req, file, callBack) => {
    callBack(null, file.originalname);
  },
});
// upload route
router.post("/upload", (req, res) => {
  let upload = multer({
    storage,
    fileFilter,
  }).array("files");

  upload(req, res, (err) => {
    if (req.fileValidationError) {
      return res.send(req.fileValidationError);
    } else if (!req.files) {
      return res.send({ message: "Please select a file to upload" });
    } else if (err instanceof multer.MulterError) {
      return res.send(err);
    } else if (err) {
      return res.send(err);
    }
    res.send({
      message: "success",
    });
  });
});

exports.routes = router;
