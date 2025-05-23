import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { ToastContainer, toast } from 'react-toastify';
import OrderAPI from '../../../api/orderApi';
import * as UserAPI from '../../../api/userApi'; // import API lấy danh sách nhân viên

const Order = () => {
  const { user } = useSelector((state) => ({ ...state }));
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filterDate, setFilterDate] = useState('');
  const [filterCustomerName, setFilterCustomerName] = useState('');
  const [staffList, setStaffList] = useState([]);
  const [filterStaffId, setFilterStaffId] = useState('');

  // Lấy danh sách nhân viên (chỉ admin mới lấy)
  useEffect(() => {
    const fetchStaffList = async () => {
      try {
        const staffData = await UserAPI.getUsers();
        setStaffList(staffData);
      } catch (error) {
        console.error('Lỗi lấy danh sách nhân viên:', error);
      }
    };

    if (user?.role_id === 1) {
      fetchStaffList();
    }
  }, [user]);

  // Lấy danh sách đơn hàng theo role user
  useEffect(() => {
    const fetchOrderByUserId = async () => {
      const data = await OrderAPI.getOrderByUserId(user.id, user.token);
      setOrders(data);
    };
    const fetchOrders = async () => {
      const data = await OrderAPI.getAllOrders(user.token);
      setOrders(data);
    };
    if (user) {
      user.role_id === 1 ? fetchOrders() : fetchOrderByUserId();
    }
  }, [user]);

  // Lọc dữ liệu
  useEffect(() => {
    let filtered = orders;

    if (filterDate) {
      filtered = filtered.filter((order) => {
        if (!order.created_at) return false;
        const orderDate = dayjs(order.created_at).format('YYYY-MM-DD');
        return orderDate === filterDate;
      });
    }

    if (filterCustomerName.trim()) {
      filtered = filtered.filter((order) => {
        const customerName = order.Customer?.name || '';
        return customerName.toLowerCase().includes(filterCustomerName.toLowerCase());
      });
    }

    if (filterStaffId) {
      filtered = filtered.filter((order) => order.user_id === Number(filterStaffId));
    }

    setFilteredOrders(filtered);
  }, [orders, filterDate, filterCustomerName, filterStaffId]);

  // Body template các cột

  const customerBodyTemplate = (rowData) => {
    const customerName = rowData.Customer?.name;
    return <p className="text-gray-700">{customerName || ''}</p>;
  };

  const orderBodyTemplate = (rowData) => {
    const isDeposit = rowData.is_deposit;
    return (
      <div className="flex items-center">
        {rowData.order_id}
        {isDeposit && <p className="text-red-600 text-xs ml-2">(Đã đặt cọc)</p>}
      </div>
    );
  };

  const userBodyTemplate = (rowData) => {
    const userName = rowData.User?.name;
    return <p className="text-gray-700">{userName || ''}</p>;
  };

  const statusBodyTemplate = (rowData) => {
    const statusName = rowData.OrderStatus?.status_name;
    return <p className="text-gray-700">{statusName || ''}</p>;
  };

  const promotionsBodyTemplate = (rowData) => {
    const promotionCode = rowData.Promotion?.promotion_code;
    return <p className="text-gray-700">{promotionCode || ''}</p>;
  };

  const totalBodyTemplate = (rowData) => {
    const totalAmount = rowData.total;
    return (
      <p className="text-gray-700">
        {totalAmount
          ? new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
            }).format(totalAmount)
          : ''}
      </p>
    );
  };

  const createdAtBodyTemplate = (rowData) => {
    const createdAt = rowData.created_at;
    return (
      <p className="text-gray-700">{createdAt ? dayjs(createdAt).format('DD/MM/YYYY HH:mm:ss') : ''}</p>
    );
  };

  return (
    <div className="bg-[#FFFFFF] p-4 rounded-lg shadow-md">
      <ToastContainer />

      {/* Bộ lọc */}
      <div className="flex flex-row justify-between items-center mb-4 gap-4 flex-wrap">
        <h1 className="text-[32px] font-bold">Order List</h1>

        <div>
          <label htmlFor="filterCustomerName" className="mr-2 font-semibold">
            Tìm kiếm theo tên khách hàng:
          </label>
          <input
            id="filterCustomerName"
            type="text"
            value={filterCustomerName}
            onChange={(e) => setFilterCustomerName(e.target.value)}
            className="border rounded px-2 py-1"
            placeholder="Nhập tên khách hàng"
          />
        </div>

        <div>
          <label htmlFor="filterDate" className="mr-2 font-semibold">
            Tìm kiếm theo ngày tạo:
          </label>
          <input
            id="filterDate"
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="border rounded px-2 py-1"
            onKeyDown={(e) => {
              if (e.key === 'Delete' || e.key === 'Backspace') {
                setFilterDate('');
              }
            }}
          />
        </div>

        {/* Dropdown lọc theo nhân viên chỉ hiện cho admin */}
        {user?.role_id === 1 && (
          <div>
            <label htmlFor="filterStaffId" className="mr-2 font-semibold">
              Tìm kiếm theo nhân viên:
            </label>
            <select
              id="filterStaffId"
              value={filterStaffId}
              onChange={(e) => setFilterStaffId(e.target.value)}
              className="border rounded px-2 py-1"
            >
              <option value="">-- Tất cả nhân viên --</option>
              {staffList.map((staff) => (
                <option key={staff.id} value={staff.id}>
                  {staff.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <DataTable
        value={filteredOrders}
        paginator
        rows={10}
        showGridlines
        paginatorTemplate="PrevPageLink PageLinks NextPageLink"
      >
        <Column
          field="order_id"
          header="Mã Đơn Hàng"
          sortable
          headerClassName="bg-[#d2d4d6]"
          body={orderBodyTemplate}
        />
        <Column
          field="customer_id"
          header="Tên Khách Hàng"
          sortable
          headerClassName="bg-[#d2d4d6]"
          body={customerBodyTemplate}
        />
        {user && user.role_id === 1 && (
          <Column
            field="user_id"
            header="Tên Nhân Viên"
            sortable
            headerClassName="bg-[#d2d4d6]"
            body={userBodyTemplate}
          />
        )}
        <Column
          field="promotion_id"
          header="Mã Khuyến Mãi"
          sortable
          headerClassName="bg-[#d2d4d6]"
          body={promotionsBodyTemplate}
        />
        <Column
          field="status_id"
          header="Trạng Thái"
          sortable
          headerClassName="bg-[#d2d4d6]"
          body={statusBodyTemplate}
        />
        <Column
          field="total"
          header="Giá Trị Đơn Hàng"
          sortable
          headerClassName="bg-[#d2d4d6]"
          body={totalBodyTemplate}
        />
        <Column
          field="created_at"
          header="Ngày Tạo"
          sortable
          headerClassName="bg-[#d2d4d6]"
          body={createdAtBodyTemplate}
        />
        <Column
          body={(rowData) => {
            const status = rowData.OrderStatus?.status_name?.toLowerCase();

            const handleClick = () => {
              if (status === 'đã hủy' || status === 'đã giao') {
                toast.error('Đơn hàng đã hoàn tất không thể chỉnh sửa!');
              } else {
                window.location.href = `/admin/orders/edit/${rowData.order_id}`;
              }
            };

            return (
              <div className="flex flex-row gap-2 justify-center">
                <button onClick={handleClick} className="bg-green-500 text-white px-4 py-2 rounded">
                  Update
                </button>
              </div>
            );
          }}
          headerStyle={{ width: '8rem', textAlign: 'center' }}
          bodyStyle={{ textAlign: 'center' }}
          headerClassName="bg-[#d2d4d6]"
        />
      </DataTable>
    </div>
  );
};

export default Order;
