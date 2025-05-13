import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";

import "react-toastify/dist/ReactToastify.css";

import AdminRoute from "./components/routes/AdminRoute";

import AdminLayout from "./layout/AdminLayout";
import './App.css';

import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import ForgotPassword from "./pages/AuthPages/ForgotPassword";

import Category from "./pages/admin/Category/index";
import AddCategory from "./pages/admin/Category/add";
import EditCategory from "./pages/admin/Category/edit";

import Product from "./pages/admin/Product/index";
import AddProduct from "./pages/admin/Product/add";
import EditProduct from "./pages/admin/Product/edit";

import SubCategory from "./pages/admin/SubCategory/index";
import AddSubCategory from "./pages/admin/SubCategory/add";
import EditSubCategory from "./pages/admin/SubCategory/edit";

import Promotion from "./pages/admin/Promotion/index";
import AddPromotion from "./pages/admin/Promotion/add";
import EditPromotion from "./pages/admin/Promotion/edit";

import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";

import { useDispatch } from "react-redux";
function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const userFromStorage = localStorage.getItem("user");
    if (userFromStorage) {
      try {
        const parsedUser = JSON.parse(userFromStorage);
        dispatch({
          type: "LOGGED_IN_USER",
          payload: parsedUser,
        });
      } catch (err) {
        console.error("Lỗi parse user:", err);
      }
    }
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route element={<AdminLayout />}>
          {/* Categories */}
          <Route
            path="/admin/categories"
            element={
              <AdminRoute>
                <Category />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/categories/add"
            element={
              <AdminRoute>
                <AddCategory />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/categories/edit/:id"
            element={
              <AdminRoute>
                <EditCategory />
              </AdminRoute>
            }
          />

          {/* Subcategories */}
          <Route
            path="/admin/subcategories"
            element={
              <AdminRoute>
                <SubCategory />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/subcategories/add"
            element={
              <AdminRoute>
                <AddSubCategory />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/subcategories/edit/:id"
            element={
              <AdminRoute>
                <EditSubCategory />
              </AdminRoute>
            }
          />

          {/* Products */}
          <Route
            path="/admin/products"
            element={
              <AdminRoute>
                <Product />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/products/add"
            element={
              <AdminRoute>
                <AddProduct />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/products/edit/:id"
            element={
              <AdminRoute>
                <EditProduct />
              </AdminRoute>
            }
          />

          {/* Promotions */}
          <Route
            path="/admin/promotions"
            element={
              <AdminRoute>
                <Promotion />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/promotions/add"
            element={
              <AdminRoute>
                <AddPromotion />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/promotions/edit/:id"
            element={
              <AdminRoute>
                <EditPromotion />
              </AdminRoute>
            }
          />
        </Route>

        <Route path="/" element={<Home />} />
        <Route path="/product-detail/:id" element={<ProductDetail />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot/password" element={<ForgotPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
