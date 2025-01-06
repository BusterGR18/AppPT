
const express = require('express');
const router = express.Router();
const boardController = require('../controllers/boardController');

// Routes
router.post('/create', boardController.createBoard);
router.get('/:userId', boardController.getBoards);
router.put('/update/:boardId', boardController.updateBoard);
router.delete('/delete/:boardId', boardController.deleteBoard);

module.exports = router;