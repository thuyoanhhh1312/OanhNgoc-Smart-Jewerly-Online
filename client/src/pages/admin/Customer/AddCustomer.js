import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCustomer } from "../../../api/customerApi";
import Swal from "sweetalert2";

const AddCustomer = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "Nam",
    address: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const token = JSON.parse(localStorage.getItem("user"))?.token;
    await createCustomer(form, token);  // Truyền token vào api

    Swal.fire({
      icon: "success",
      title: "Thành công",
      text: "Thêm khách hàng thành công!",
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
    navigate("/admin/customers");
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Lỗi",
      text: "Thêm khách hàng thất bại!",
    });
  }
};


  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-full mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Thêm khách hàng mới</h2>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Họ tên</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded p-2"
          placeholder="Nhập họ tên"
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
        <label className="block mb-1 font-medium">Điện thoại</label>
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 rounded p-2"
          placeholder="Nhập số điện thoại"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Giới tính</label>
        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded p-2"
        >
          <option value="Nam">Nam</option>
          <option value="Nữ">Nữ</option>
        </select>
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Địa chỉ</label>
        <textarea
          name="address"
          value={form.address}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded p-2"
          placeholder="Nhập địa chỉ"
        />
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => navigate("/admin/customers")}
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

export default AddCustomer;
