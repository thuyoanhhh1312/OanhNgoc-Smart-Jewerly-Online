// routes/apiRoutes.js
import express from 'express';
const router = express.Router();

// Middleware
import { authCheck, adminCheck } from '../middlewares/auth.js';
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
router.post('/register', authController.registerUser);
router.post('/create-or-update-user', authCheck, authController.createOrUpdateUser);
router.post('/current-user', authCheck, authController.currentUser);
router.post('/current-admin', authCheck, adminCheck, authController.currentUser);
router.post('/login', authController.loginUser);

// User routes
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

// Category routes
router.get('/categories', categoryController.getAllCategories);
router.get('/categories/:id', categoryController.getCategoryById);
router.post('/categories', authCheck, adminCheck, categoryController.createCategory);
router.put('/categories/:id', authCheck, adminCheck, categoryController.updateCategory);
router.delete('/categories/:id', authCheck, adminCheck, categoryController.deleteCategory);

// Product routes
router.get('/products', productController.getAllProducts);
router.get('/products/:id', productController.getProductById);
router.post('/products', authCheck, adminCheck, upload.array('images', 5), productController.createProduct);
router.put('/products/:id', authCheck, adminCheck, upload.array('images', 5), productController.updateProduct);
router.delete('/products/:id', authCheck, adminCheck, productController.deleteProduct);

// SubCategory routes
router.get('/subcategories', subCategoryController.getAllSubCategories);
router.get('/subcategories/:id', subCategoryController.getSubCategoryById);
router.post('/subcategories', authCheck, adminCheck, subCategoryController.createSubCategory);
router.put('/subcategories/:id', authCheck, adminCheck, subCategoryController.updateSubCategory);
router.delete('/subcategories/:id', authCheck, adminCheck, subCategoryController.deleteSubCategory);

// Promotion routes
router.get('/promotions', promotionController.getAllPromotions);
router.get('/promotions/:id', promotionController.getPromotionById);
router.post('/promotions', authCheck, adminCheck, promotionController.createPromotion);
router.put('/promotions/:id', authCheck, adminCheck, promotionController.updatePromotion);
router.delete('/promotions/:id', authCheck, adminCheck, promotionController.deletePromotion);

export default router;
