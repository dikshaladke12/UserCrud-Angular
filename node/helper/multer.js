const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./images");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
}) 

const filefilter = (req, file, cb) => {
    const filetype = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!filetype.includes(file.mimetype)) {
        return cb(new Error("this file type is not allowed"));
    }
    cb(null, true);
}

const helperUpload = multer({
    storage: storage,
    fileFilter: filefilter,
    limit: { filesize: 50 * 1024 * 1024 }
}).single("image");

module.exports = { helperUpload };