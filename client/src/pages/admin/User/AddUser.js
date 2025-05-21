import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../../../api/userApi";
import Swal from "sweetalert2";

const AddUser = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role_id: "3", // mặc định là staff (ví dụ)
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Lấy token từ localStorage
    const token = JSON.parse(localStorage.getItem("user"))?.token;

    try {
      await createUser(form, token);
      Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Thêm nhân viên thành công!",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      navigate("/admin/user");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: error.response?.data?.message || "Thêm nhân viên thất bại!",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-lg mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Thêm nhân viên mới</h2>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Tên</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded p-2"
          placeholder="Nhập tên"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Email</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded p-2"
          placeholder="Nhập email"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Mật khẩu</label>
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded p-2"
          placeholder="Nhập mật khẩu"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Role</label>
        <select
          name="role_id"
          value={form.role_id}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded p-2"
        >
          <option value="1">Admin</option>
          <option value="3">Staff</option>
        </select>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => navigate("/admin/user")}
          className="px-4 py-2 bg-gray-300 rounded"
        >
          Hủy
        </button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          Lưu
        </button>
      </div>
    </form>
  );
};

export default AddUser;
