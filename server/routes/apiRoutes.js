const express = require('express');
const router = express.Router();

// Import các controller
const roleController = require('../controllers/roleController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const categoryController = require('../controllers/categoryController');
const productController = require('../controllers/productController');
const subCategoryController = require('../controllers/subCategoryController');
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

// Route để lấy tất cả các danh mục
router.get('/categories', categoryController.getAllCategories);
router.get('/categories/:id', categoryController.getCategoryById); // Lấy danh mục theo ID
router.post('/categories', categoryController.createCategory); // Tạo danh mục mới  '
router.put('/categories/:id', categoryController.updateCategory); // Cập nhật danh mục
router.delete('/categories/:id', categoryController.deleteCategory); // Xóa danh mục

// Các route liên quan đến sản phẩm
router.get('/products', productController.getAllProducts); // Lấy tất cả sản phẩm
router.get('/products/:id', productController.getProductById); // Lấy sản phẩm theo ID
router.post('/products', productController.createProduct); // Tạo sản phẩm mới
router.put('/products/:id', productController.updateProduct); // Cập nhật sản phẩm
router.delete('/products/:id', productController.deleteProduct); // Xóa sản phẩm
// Các route API khác có thể được thêm ở đây
router.get('/subcategories', subCategoryController.getAllSubCategories); // Lấy tất cả danh mục con
router.get('/subcategories/:id', subCategoryController.getSubCategoryById); // Lấy danh mục con theo ID
router.post('/subcategories', subCategoryController.createSubCategory); // Tạo danh mục con mới
router.put('/subcategories/:id', subCategoryController.updateSubCategory); // Cập nhật danh mục con
router.delete('/subcategories/:id', subCategoryController.deleteSubCategory); // Xóa danh mục con
module.exports = router;
