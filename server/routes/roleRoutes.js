// routes/roleRoutes.js
const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');

router.get('/get-all', roleController.getAllRoles);

module.exports = router;
