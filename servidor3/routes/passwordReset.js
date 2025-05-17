const express = require('express');
const router = express.Router();
const { requestReset, confirmReset } = require('../controllers/passwordResetController');

router.post('/forgot-password', requestReset);
router.post('/reset-password', confirmReset);

module.exports = router;
