
import React, { useEffect, useState, useRef } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { getCustomers, deleteCustomer } from "../../../api/customerApi";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";


const CustomerList = () => {
  const { user } = useSelector((state) => ({ ...state }));
  const [customers, setCustomers] = useState([]);
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();
  // Ref để giữ timeout debounce
  const debounceTimeout = useRef(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async (searchKeyword = "") => {
    try {
      const data = await getCustomers(searchKeyword);
      setCustomers(data);
    } catch (error) {
      alert("Lấy danh sách khách hàng lỗi");
    }
  };
  // Hàm gọi khi input thay đổi
  const handleKeywordChange = (e) => {
    const value = e.target.value;
    setKeyword(value);

    // Clear timeout nếu người dùng gõ tiếp
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    // Đặt timeout gọi API sau 500ms kể từ lần gõ cuối
    debounceTimeout.current = setTimeout(() => {
      fetchCustomers(value);
    }, 500);
  };
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa khách hàng này?")) {
      try {
        await deleteCustomer(id);
        alert("Xóa thành công");
        fetchCustomers(keyword);
      } catch {
        alert("Lỗi khi xóa khách hàng");
      }
    }
  };

  const handleSearch = () => {
    fetchCustomers(keyword);
  };

  // Template cho các cột nếu cần custom hiển thị, ví dụ cột hành động
  const actionBodyTemplate = (rowData) => (
    <div className="flex gap-2">
      <Link to={`/admin/customers/edit/${rowData.customer_id}`}>
        <button className="bg-green-500 text-white px-4 py-2 rounded">Edit</button>
      </Link>
      <button
        onClick={() => handleDelete(rowData.customer_id)}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Delete
      </button>
    </div>
  );

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 flex justify-between items-center">
        <span>Customer List</span>
        <button button
          onClick={() => navigate("/admin/customers/add")}
          className="bg-blue-500 text-white px-0 py-1 rounded"
        >
          Thêm khách hàng mới
        </button>
      </h1>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên, email, số điện thoại..."
          className="border border-gray-300 rounded p-2 flex-1"
          value={keyword}
          onChange={handleKeywordChange}
        />
      </div>


      <DataTable
        value={customers}
        paginator
        rows={10}
        showGridlines
        paginatorTemplate="PrevPageLink PageLinks NextPageLink"
        emptyMessage="Không có dữ liệu khách hàng"
        responsiveLayout="scroll"
      >
        <Column field="name" header="Họ tên" sortable headerClassName="bg-gray-200" />
        <Column field="email" header="Email" sortable headerClassName="bg-gray-200" />
        <Column field="phone" header="Điện thoại" sortable headerClassName="bg-gray-200" />
        <Column field="gender" header="Giới tính" sortable headerClassName="bg-gray-200" />
        <Column field="address" header="Địa chỉ" sortable headerClassName="bg-gray-200" />
        <Column body={actionBodyTemplate} header="Hành động" headerClassName="bg-gray-200" />
      </DataTable>
    </div>
  );
};

export default CustomerList;

