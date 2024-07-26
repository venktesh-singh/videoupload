const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'video_upload') {
            cb(null, 'public/uploads/video');
        } else if (file.fieldname === 'video_img') {
            cb(null, 'public/uploads/videoimg');
        }
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

function checkFileType(file, cb) {
    const videoTypes = /mp4|mov|avi|wmv/;
    const imageTypes = /jpeg|jpg|png|gif/;
    const extname = (videoTypes.test(path.extname(file.originalname).toLowerCase()) || imageTypes.test(path.extname(file.originalname).toLowerCase()));
    const mimetype = (videoTypes.test(file.mimetype) || imageTypes.test(file.mimetype));

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Incorrect File type');
    }
}

const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
}).fields([
    { name: 'video_upload', maxCount: 5 },
    { name: 'video_img', maxCount: 1 }
]);

module.exports = upload;
