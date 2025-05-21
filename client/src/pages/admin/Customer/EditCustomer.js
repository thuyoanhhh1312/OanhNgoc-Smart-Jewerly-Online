import React, { useEffect, useState } from "react";
import { getCustomerById, updateCustomer } from "../../../api/customerApi";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

const EditCustomer = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "Nam",
    address: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const customer = await getCustomerById(id);
        setForm({
          name: customer.name || "",
          email: customer.email || "",
          phone: customer.phone || "",
          gender: customer.gender || "Nam",
          address: customer.address || "",
        });
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Lỗi!",
          text: "Không tải được dữ liệu khách hàng.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateCustomer(id, form);
      await Swal.fire({
        icon: "success",
        title: "Thành công",
        text: "Cập nhật khách hàng thành công!",
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      navigate("/admin/customers");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Cập nhật khách hàng thất bại!",
      });
    }
  };

  if (loading) return <div>Đang tải dữ liệu...</div>;

  return (
    <div className="p-4 max-w-2xl mx-auto bg-white rounded shadow">
      <h2 className="text-xl font-semibold mb-6">Chỉnh sửa khách hàng</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Họ tên</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded p-2"
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

        <div className="mb-6">
          <label className="block mb-1 font-medium">Địa chỉ</label>
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2"
            rows={4}
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

          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Lưu
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCustomer;
