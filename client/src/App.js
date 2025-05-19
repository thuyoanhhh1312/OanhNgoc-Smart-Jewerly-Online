import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";

import "react-toastify/dist/ReactToastify.css";

import AdminRoute from "./components/routes/AdminRoute";
import UserRoute from "./components/routes/UserRoute";
import AdminOrStaffRoute from "./components/routes/AdminOrStaffRoute";

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

import User from "./pages/admin/User";
import EditUser from "./pages/admin/User/edit";

import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import UpdateProfile from "./pages/Customer/UpdateProfile";

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
          { /*User*/}
          <Route
            path="/admin/user"
            element={
              <AdminOrStaffRoute>
                <User />
              </AdminOrStaffRoute>
            }
          />
          <Route
            path="/admin/user/edit/:id"
            element={
              <AdminOrStaffRoute>
                <EditUser />
              </AdminOrStaffRoute>
            }
          />

          {/* Categories */}
          <Route
            path="/admin/categories"
            element={
              <AdminOrStaffRoute>
                <Category />
              </AdminOrStaffRoute>
            }
          />
          <Route
            path="/admin/categories/add"
            element={
              <AdminOrStaffRoute>
                <AddCategory />
              </AdminOrStaffRoute>
            }
          />
          <Route
            path="/admin/categories/edit/:id"
            element={
              <AdminOrStaffRoute>
                <EditCategory />
              </AdminOrStaffRoute>
            }
          />

          {/* Subcategories */}
          <Route
            path="/admin/subcategories"
            element={
              <AdminOrStaffRoute>
                <SubCategory />
              </AdminOrStaffRoute>
            }
          />
          <Route
            path="/admin/subcategories/add"
            element={
              <AdminOrStaffRoute>
                <AddSubCategory />
              </AdminOrStaffRoute>
            }
          />
          <Route
            path="/admin/subcategories/edit/:id"
            element={
              <AdminOrStaffRoute>
                <EditSubCategory />
              </AdminOrStaffRoute>
            }
          />

          {/* Products */}
          <Route
            path="/admin/products"
            element={
              <AdminOrStaffRoute>
                <Product />
              </AdminOrStaffRoute>
            }
          />
          <Route
            path="/admin/products/add"
            element={
              <AdminOrStaffRoute>
                <AddProduct />
              </AdminOrStaffRoute>
            }
          />
          <Route
            path="/admin/products/edit/:id"
            element={
              <AdminOrStaffRoute>
                <EditProduct />
              </AdminOrStaffRoute>
            }
          />

          {/* Promotions */}
          <Route
            path="/admin/promotions"
            element={
              <AdminOrStaffRoute>
                <Promotion />
              </AdminOrStaffRoute>
            }
          />
          <Route
            path="/admin/promotions/add"
            element={
              <AdminOrStaffRoute>
                <AddPromotion />
              </AdminOrStaffRoute>
            }
          />
          <Route
            path="/admin/promotions/edit/:id"
            element={
              <AdminOrStaffRoute>
                <EditPromotion />
              </AdminOrStaffRoute>
            }
          />
        </Route>

        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/product-detail/:id" element={<ProductDetail />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot/password" element={<ForgotPassword />} />

        <Route
          path="/profile"
          element={
            <UserRoute>
              <UpdateProfile />
            </UserRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
