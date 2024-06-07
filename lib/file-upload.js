const multer = require('multer')
const mongoose = require('mongoose')
const path = require('path')

// Set up storage configuration for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, global.__rootdir + '/public/uploads/'); // specify the directory to save the uploaded files
    },
    filename: function (req, file, cb) {
        const objectId = new mongoose.Types.ObjectId();

        cb(null, objectId.toString() + path.extname(file.originalname)); // generate a unique name with original extension
    }
});

// Set up multer middleware
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Error: jpeg or png Images Only!'));
    }
})

module.exports = upload;