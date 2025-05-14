// routes/apiRoutes.js
import express from 'express';
const router = express.Router();

// Middleware
import { isAdmin, authenticateToken } from '../middlewares/auth.js';
import upload from '../middlewares/upload.js';

// Controllers
import * as roleController from '../controllers/roleController.js';
import * as userController from '../controllers/userController.js';
import * as authController from '../controllers/authController.js';
import * as categoryController from '../controllers/categoryController.js';
import * as productController from '../controllers/productController.js';
import * as subCategoryController from '../controllers/subCategoryController.js';
import * as promotionController from '../controllers/promotionController.js';

// Role routes
router.get('/role', roleController.getAllRoles);
router.post('/role', roleController.createRole);

// Auth routes
router.post('/auth/register', authController.registerUser);
router.post('/auth/login', authController.loginUser);
router.post('/auth/refresh-token', authController.refreshToken);
router.post('/auth/logout', authenticateToken, authController.logoutUser);
router.get('/auth/current-admin', authenticateToken, isAdmin, authController.currentAdmin);
router.post('/auth/refresh-token', authController.refreshToken);


// User routes
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.put('/users/:id', authenticateToken, isAdmin, userController.updateUser);
router.delete('/users/:id', authenticateToken, isAdmin, userController.deleteUser);

// Category routes
router.get('/categories', categoryController.getAllCategories);
router.get('/categories/:id', categoryController.getCategoryById);
router.post('/categories', authenticateToken, isAdmin, categoryController.createCategory);
router.put('/categories/:id', authenticateToken, isAdmin, categoryController.updateCategory);
router.delete('/categories/:id', authenticateToken, isAdmin, categoryController.deleteCategory);

// Product routes
router.get('/products', productController.getAllProducts);
router.get('/products/:id', productController.getProductById);
router.post('/products', authenticateToken, isAdmin, upload.array('images', 5), productController.createProduct);
router.put('/products/:id', authenticateToken, isAdmin, upload.array('images', 5), productController.updateProduct);
router.delete('/products/:id', authenticateToken, isAdmin, productController.deleteProduct);

// SubCategory routes
router.get('/subcategories', subCategoryController.getAllSubCategories);
router.get('/subcategories/:id', subCategoryController.getSubCategoryById);
router.post('/subcategories', authenticateToken, isAdmin, subCategoryController.createSubCategory);
router.put('/subcategories/:id', authenticateToken, isAdmin, subCategoryController.updateSubCategory);
router.delete('/subcategories/:id', authenticateToken, isAdmin, subCategoryController.deleteSubCategory);

// Promotion routes
router.get('/promotions', promotionController.getAllPromotions);
router.get('/promotions/:id', promotionController.getPromotionById);
router.post('/promotions', authenticateToken, isAdmin, promotionController.createPromotion);
router.put('/promotions/:id', authenticateToken, isAdmin, promotionController.updatePromotion);
router.delete('/promotions/:id', authenticateToken, isAdmin, promotionController.deletePromotion);

export default router;
