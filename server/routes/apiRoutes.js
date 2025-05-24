// routes/apiRoutes.js
import express from 'express';
import { getSimilarProducts, filterProducts } from '../controllers/productController.js';


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
import * as customerController from '../controllers/customerController.js';
import * as orderStatusController from '../controllers/orderStatusController.js';
import * as productReviewController from '../controllers/productReviewController.js';
import * as searchController from '../controllers/searchController.js';
import * as dashboardController from '../controllers/dashboardController.js';
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
// Thêm nhân viên (chỉ admin)
router.post('/users', authenticateToken, isAdmin, userController.createUser);

// Sửa nhân viên (admin hoặc staff có thể sửa, tùy bạn)
router.put('/users/:id', authenticateToken, isAdminOrStaff, userController.updateUser);
router.delete('/users/:id', authenticateToken, isAdminOrStaff, userController.deleteUser);

// Customer routes
router.get('/customers', customerController.getAllCustomers);
router.get('/customers/:id', customerController.getCustomerById);
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
router.get('/products/with-review-summary', productController.getAllProductsWithRatingSummary);
router.get('/product-by-category', productController.getProductsByCategoryWithRatingSummary);
router.get('/products/similar', getSimilarProducts);
router.get('/products/filter', filterProducts);
router.get('/products/:id', productController.getProductById);
router.get('/get-product-by-slug/:slug', productController.getProductBySlug);
router.post('/products', authenticateToken, isAdminOrStaff, upload.array('images', 5), productController.createProduct);
router.put('/products/:id', authenticateToken, isAdminOrStaff, upload.array('images', 5), productController.updateProduct);
router.delete('/products/:id', authenticateToken, isAdminOrStaff, productController.deleteProduct);
router.get('/get-category-subcategory', productController.getCategoryesWithSubCategory);
router.get('/get-product-top-rated-by-sentiment', productController.getTopRatedProductsBySentiment);


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
router.post('/orders', authenticateToken, orderController.createOrder);
router.put('/orders/:id', authenticateToken, isAdminOrStaff, orderController.updatedOrder);
router.put('/update-staff/:id', authenticateToken, isAdmin, orderController.updatedStaff);
router.get('/orders/user/:user_id', authenticateToken, isAdminOrStaff, orderController.getOrderByUserId);
router.patch('/orders/:id/deposit', authenticateToken, isAdminOrStaff, orderController.updateIsDeposit);

// Order Status routes
router.get('/order-status', orderStatusController.getAllOrderStatuses);

// Product Review
router.get('/products/:id/reviews', productReviewController.getReviewsByProductId);
router.get('/products/:id/reviews/summary', productReviewController.getReviewSummary);

router.post('/products/:id/reviews', authenticateToken, productReviewController.createReview);

// Search routes
router.get("/search-product", searchController.searchProducts);
router.get("/quick-search-products", searchController.quickSearchProducts);

//Dashboard routes
router.get('/dashboard/revenue', authenticateToken, isAdmin, dashboardController.getRevenueByPeriod);
router.get('/dashboard/orders/count', authenticateToken, isAdmin, dashboardController.getOrderCountByPeriod);

export default router;