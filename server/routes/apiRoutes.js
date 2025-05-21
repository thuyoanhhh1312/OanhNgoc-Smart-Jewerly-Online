// routes/apiRoutes.js
import express from 'express';
import { getSimilarProducts } from '../controllers/productController.js';

const router = express.Router();

// Middleware
import { isAdmin, authenticateToken, isAdminOrStaff } from '../middlewares/auth.js';
import upload from '../middlewares/upload.js';

// Controllers
import * as roleController from '../controllers/roleController.js';
import * as userController from '../controllers/userController.js';
import * as authController from '../controllers/authController.js';
import * as categoryController from '../controllers/categoryController.js';
import * as productController from '../controllers/productController.js';
import * as subCategoryController from '../controllers/subCategoryController.js';
import * as promotionController from '../controllers/promotionController.js';
import * as orderController from '../controllers/orderController.js';
import * as orderController from '../controllers/orderController.js';
import * as customerController from '../controllers/customerController.js';
import * as orderController from '../controllers/orderController.js';
import * as orderStatusController from '../controllers/orderStatusController.js';
// Role routes
router.get('/role', roleController.getAllRoles);
router.post('/role', roleController.createRole);

// Auth routes
router.post('/auth/register', authController.registerUser);
router.post('/auth/login', authController.loginUser);
router.post('/auth/refresh-token', authController.refreshToken);
router.post('/auth/logout', authenticateToken, authController.logoutUser);
router.get('/auth/current-admin', authenticateToken, isAdmin, authController.currentAdmin);
router.get('/auth/current-admin-or-staff', authenticateToken, isAdminOrStaff, authController.currentStaffOrAdmin);
router.get('/auth/current-user', authenticateToken, authController.currentUser);
router.post('/auth/refresh-token', authController.refreshToken);


// User routes
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.put('/users/:id', authenticateToken, isAdminOrStaff, userController.updateUser);
router.delete('/users/:id', authenticateToken, isAdminOrStaff, userController.deleteUser);

// Customer routes
router.get('/customers', customerController.getAllCustomers);
router.get('/customers/:id', customerController.getCustomerById);
router.post('/customers', authenticateToken, customerController.createCustomer);
router.put('/customers/:id', authenticateToken, customerController.updateCustomer);
router.delete('/customers/:id', authenticateToken, customerController.deleteCustomer);

// //Customer routes
// router.post("/profile", authenticateToken, customerController.upsertCustomerProfile);
// Customer routes
router.get('/customers', customerController.getAllCustomers);
router.get('/customers/:id', customerController.getCustomerById);
router.post('/customers', authenticateToken, customerController.createCustomer);
router.put('/customers/:id', authenticateToken, customerController.updateCustomer);
router.delete('/customers/:id', authenticateToken, customerController.deleteCustomer);

// //Customer routes
// router.post("/profile", authenticateToken, customerController.upsertCustomerProfile);

// Category routes
router.get('/categories', categoryController.getAllCategories);
router.get('/categories/:id', categoryController.getCategoryById);
router.post('/categories', authenticateToken, isAdminOrStaff, categoryController.createCategory);
router.put('/categories/:id', authenticateToken, isAdminOrStaff, categoryController.updateCategory);
router.delete('/categories/:id', authenticateToken, isAdminOrStaff, categoryController.deleteCategory);

// Product routes
router.get('/products', productController.getAllProducts);
router.get('/products/similar', getSimilarProducts); // Lấy sản phẩm tương tự
router.get('/products/:id', productController.getProductById);
router.post('/products', authenticateToken, isAdminOrStaff, upload.array('images', 5), productController.createProduct);
router.put('/products/:id', authenticateToken, isAdminOrStaff, upload.array('images', 5), productController.updateProduct);
router.delete('/products/:id', authenticateToken, isAdminOrStaff, productController.deleteProduct);

// SubCategory routes
router.get('/subcategories', subCategoryController.getAllSubCategories);
router.get('/subcategories/:id', subCategoryController.getSubCategoryById);
router.post('/subcategories', authenticateToken, isAdminOrStaff, subCategoryController.createSubCategory);
router.put('/subcategories/:id', authenticateToken, isAdminOrStaff, subCategoryController.updateSubCategory);
router.delete('/subcategories/:id', authenticateToken, isAdminOrStaff, subCategoryController.deleteSubCategory);

// Promotion routes
router.get('/promotions', promotionController.getAllPromotions);
router.get('/promotions/:id', promotionController.getPromotionById);
router.post('/promotions', authenticateToken, isAdminOrStaff, promotionController.createPromotion);
router.put('/promotions/:id', authenticateToken, isAdminOrStaff, promotionController.updatePromotion);
router.delete('/promotions/:id', authenticateToken, isAdminOrStaff, promotionController.deletePromotion);

// Order routes
router.get('/orders', authenticateToken, isAdmin, orderController.getAllOrders);
router.get('/orders/:id', authenticateToken, isAdminOrStaff, orderController.getOrderById);
router.put('/orders/:id', authenticateToken, isAdminOrStaff, orderController.updatedOrder);
router.put('/update-staff/:id', authenticateToken, isAdmin, orderController.updatedStaff);
router.get('/orders/user/:user_id', authenticateToken, isAdminOrStaff, orderController.getOrderByUserId);

// Order Status routes
router.get('/order-status', orderStatusController.getAllOrderStatuses);

export default router;