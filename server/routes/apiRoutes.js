// routes/apiRoutes.js
const express = require('express');
const router = express.Router();

// Import các controller
const roleController = require('../controllers/roleController');

// Route để lấy tất cả các role
router.get('/role', roleController.getAllRoles);

// Route thêm role mới
router.post('/role', roleController.createRole);

// Các route API khác có thể được thêm ở đây

module.exports = router;
