
const express = require('express');
const router = express.Router();
const boardController = require('../controllers/boardController');

// Routes
router.post('/create', boardController.createBoard);
router.get('/:userId', boardController.getBoards);
router.put('/update/:boardId', boardController.updateBoard);
router.delete('/delete/:boardId', boardController.deleteBoard);
router.post('/assignGeoType', boardController.assignGeoTypeToBoard);
router.post('/removeGeoType', boardController.removeGeoTypeFromBoard);
router.get('/:boardId/geoTypes', boardController.getGeoTypesForBoard);

module.exports = router;