/*const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');

router.get('/:useremail', settingsController.getSettings);
router.post('/:useremail', settingsController.updateSettings);

module.exports = router;
*/
//V2
// routes/settingsRoutes.js
{/**
const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/usersettingsController');

router.get('/', settingsController.getSettings);
router.post('/', settingsController.updateSettings);

module.exports = router;
 */}
//V3
const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/usersettingsController');

// Route to get user settings
router.get('/', settingsController.getSettings);

// Route to update basic user settings and notifications
router.post('/', settingsController.updateSettings);

// Route to update display statistics preferences
router.post('/update-display-statistics', settingsController.updateDisplayStatistics);
router.post('/updateExcludedContacts', settingsController.updateExcludedContacts);
module.exports = router;
