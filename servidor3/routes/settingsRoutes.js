/*const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');

router.get('/:useremail', settingsController.getSettings);
router.post('/:useremail', settingsController.updateSettings);

module.exports = router;
*/
//V2
// routes/settingsRoutes.js
const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');

router.get('/', settingsController.getSettings);
router.post('/', settingsController.updateSettings);

module.exports = router;
