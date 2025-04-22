const express = require('express');
const router = express.Router();

// Import các controller
const roleController = require('../controllers/roleController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

// Route để lấy tất cả các role
router.get('/role', roleController.getAllRoles);

// Route thêm role mới
router.post('/role', roleController.createRole);

// Route đăng ký người dùng
router.post('/register', authController.registerUser);

// Route đăng nhập người dùng
router.post('/login', authController.loginUser);

// Các route liên quan đến người dùng
router.get('/users', userController.getAllUsers); // Lấy tất cả người dùng
router.get('/users/:id', userController.getUserById); // Lấy người dùng theo ID
router.put('/users/:id', userController.updateUser); // Cập nhật thông tin người dùng
router.delete('/users/:id', userController.deleteUser); // Xóa người dùng

// Các route API khác có thể được thêm ở đây

module.exports = router;
