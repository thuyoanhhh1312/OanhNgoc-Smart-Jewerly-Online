import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";

import "react-toastify/dist/ReactToastify.css";

import AdminRoute from "./components/routes/AdminRoute";

import AdminLayout from "./layout/AdminLayout";
import './App.css';

import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import SignUpComplete from "./pages/AuthPages/SignUpComplete";
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

import { auth } from "./firebase";
import { useDispatch } from "react-redux";
import { currentUser } from "./api/auth"
function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult();
        currentUser(idTokenResult.token)
          .then((res) => {
            dispatch({
              type: "LOGGED_IN_USER",
              payload: {
                name: res.data.name,
                email: res.data.email,
                token: idTokenResult.token,
                role_id: res.data.role_id,
                _id: res.data._id,
              },
            });
          }).catch((err) => console.log(err));
      }
    });
    // cleanup
    return () => unsubscribe();
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
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signup/complete" element={<SignUpComplete />} />
        <Route path="/forgot/password" element={<ForgotPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
