const express = require('express');
const router = express.Router();
const UploadVideoController = require('../controller/uploadvideos');
const upload = require('../helper/uploadVideo');

router.get('/', UploadVideoController.getUploadVideo);
router.get('/:id', UploadVideoController.getUploadVideoById);
router.post('/add', upload, UploadVideoController.addUploadVideo);
router.put('/edit/:id', upload, UploadVideoController.editUploadVideo);
router.delete('/:id', UploadVideoController.deleteUploadVideo);

module.exports = router;
