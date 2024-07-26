const express = require('express');
const router = express.Router();
const CatVideoController = require('../controller/catvideos');

router.get('/',CatVideoController.getCatVideo);
router.get('/:id',CatVideoController.getCatVideoById);
router.post('/add',CatVideoController.addCatVideo);
router.put('/edit/:id',CatVideoController.editCatVideo);
router.delete('/:id',CatVideoController.deleteCatVideo);

module.exports= router;