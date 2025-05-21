
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
  const token = JSON.parse(localStorage.getItem("user"))?.token;

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
        await deleteCustomer(id, token);
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

      <button
        onClick={() => handleDelete(rowData.customer_id)}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Delete
      </button>
    </div>
  );
  const nameBodyTemplate = (rowData) => (
    <div title={rowData.name} className="whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">
      {rowData.name}
    </div>
  );
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className='flex flex-row justify-between items-center mb-4'>
        <h1 className='text-[32px] font-bold '>Customer List</h1>
      </div>

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
        <Column field="name" header="Họ tên" sortable headerClassName="bg-gray-200" body={nameBodyTemplate} />
        <Column field="email" header="Email" sortable headerClassName="bg-gray-200" />
        <Column field="phone" header="Điện thoại" sortable headerClassName="bg-gray-200" />
        <Column field="gender" header="Giới tính" sortable headerClassName="bg-gray-200" />
        <Column field="address" header="Địa chỉ" sortable headerClassName="bg-gray-200" />
        <Column field="orderCount" header="Số lượng đơn hàng" sortable headerClassName="bg-gray-200" />
        <Column field="totalOrderAmount" header="Tổng tiền đơn hàng" sortable headerClassName="bg-gray-200"
        
          body={(data) => data.totalOrderAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
        />
        <Column field="positiveReviewCount" header="Đánh giá tích cực" sortable headerClassName='bg-gray-200' />
<Column field="negativeReviewCount" header="Đánh giá tiêu cực" sortable headerClassName='bg-gray-200' />
<Column field="fiveStarReviewCount" header="Đánh giá 5 sao" sortable headerClassName='bg-gray-200' />


        <Column body={actionBodyTemplate} header="Hành động" headerClassName="bg-gray-200" />
      </DataTable>
    </div>
  );
};

export default CustomerList;

