import { BrowserRouter as Router, Routes, Route } from "react-router";
import AdminLayout from "./layout/AdminLayout";
import ProductAdmin from "./pages/admin/Products";
import './App.css';
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route index path="/" element={<ProductAdmin />} />
        </Route>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App;
