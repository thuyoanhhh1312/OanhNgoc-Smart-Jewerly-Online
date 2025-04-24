import { BrowserRouter as Router, Routes, Route } from "react-router";
import AdminLayout from "./layout/AdminLayout";
import ProductAdmin from "./pages/admin/Products";
import './App.css';
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import Category from "./pages/admin/Category/index";
import AddCategory from "./pages/admin/Category/add";
import EditCategory from "./pages/admin/Category/edit";

import Product from "./pages/admin/Product/index";
import AddProduct from "./pages/admin/Product/add";
import EditProduct from "./pages/admin/Product/edit";
function App() {
  return (
    <Router>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route index path="/" element={<ProductAdmin />} />
          <Route path="/categories" element={<Category />} /> 
          <Route path="/categories/add" element={<AddCategory />} />
          <Route path="/categories/edit/:id" element={<EditCategory />} />
          <Route path="/products" element={<Product />} />
          <Route path="/products/add" element={<AddProduct />} />
          <Route path="/products/edit/:id" element={<EditProduct />} />
        </Route>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

      </Routes>
    </Router>
  );
}

export default App;
