import { BrowserRouter as Router, Routes, Route } from "react-router";
import AdminLayout from "./layout/AdminLayout";
import HomeAdmin from "./pages/admin/Home";
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<AdminLayout />}>
          <Route index path="/" element={<HomeAdmin />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
