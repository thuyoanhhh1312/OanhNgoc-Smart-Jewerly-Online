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

import SubCategory from "./pages/admin/SubCategory/index";
import AddSubCategory from "./pages/admin/SubCategory/add";
import EditSubCategory from "./pages/admin/SubCategory/edit";

import Promotion from "./pages/admin/Promotion/index";
import AddPromotion from "./pages/admin/Promotion/add";
import EditPromotion from "./pages/admin/Promotion/edit";
function App() {
  return (
    <Router>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route index path="/" element={<ProductAdmin />} />
          {/* categories */}
          <Route path="/categories" element={<Category />} /> 
          <Route path="/categories/add" element={<AddCategory />} />
          <Route path="/categories/edit/:id" element={<EditCategory />} />
          {/* subcategories */}
          <Route path="/subcategories" element={<SubCategory />} />
          <Route path="/subcategories/add" element={<AddSubCategory />} />
          <Route path="/subcategories/edit/:id" element={<EditSubCategory />} />
          {/* products */}
          <Route path="/products" element={<Product />} />
          <Route path="/products/add" element={<AddProduct />} />
          <Route path="/products/edit/:id" element={<EditProduct />} />

          {/* promotions */}
          <Route path="/promotions" element={<Promotion />} />
          <Route path="/promotions/add" element={<AddPromotion />} />
          <Route path="/promotions/edit/:id" element={<EditPromotion />} />

        </Route>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

      </Routes>
    </Router>
  );
}

export default App;
