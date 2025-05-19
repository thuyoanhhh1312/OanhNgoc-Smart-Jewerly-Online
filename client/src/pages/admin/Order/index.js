import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import React, { useEffect, useState } from "react";
import OrderAPI from "../../../api/orderApi";
import { Link } from "react-router";
import { useSelector } from "react-redux";
import dayjs from "dayjs";

const Order = () => {
  const { user } = useSelector((state) => ({ ...state }));
  const [orders, setOrders] = useState([]);

  console.log("orders", orders);

  const customerBodyTemplate = (rowData) => {
    const customerName = rowData.Customer.name;
    return (
      <div>
        {customerName ? (
          <p className="text-gray-700">{customerName}</p>
        ) : (
          <p className="text-gray-700"></p>
        )}
      </div>
    );
  };

  const userBodyTemplate = (rowData) => {
    const userName = rowData.User.name;
    return (
      <div>
        {userName ? (
          <p className="text-gray-700">{userName}</p>
        ) : (
          <p className="text-gray-700"></p>
        )}
      </div>
    );
  };

  const statusBodyTemplate = (rowData) => {
    const statusName = rowData.OrderStatus.status_name;
    return (
      <div>
        {statusName ? (
          <p className="text-gray-700">{statusName}</p>
        ) : (
          <p className="text-gray-700"></p>
        )}
      </div>
    );
  };

  const totalBodyTemplate = (rowData) => {
    const totalAmount = rowData.total;
    return (
      <div>
        {totalAmount ? (
          <p className="text-gray-700">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(totalAmount)}
          </p>
        ) : (
          <p className="text-gray-700"></p>
        )}
      </div>
    );
  };

  const createdAtBodyTemplate = (rowData) => {
    const createdAt = rowData.created_at;
    return (
      <div>
        {createdAt ? (
          <p className="text-gray-700">
            {dayjs(createdAt).format("DD/MM/YYYY HH:mm:ss")}
          </p>
        ) : (
          <p className="text-gray-700"></p>
        )}
      </div>
    );
  };

  useEffect(() => {
    const fetchOrderByUserId = async () => {
      const data = await OrderAPI.getOrderByUserId(user.id, user.token);
      setOrders(data);
    };
    const fetchOrders = async () => {
      const data = await OrderAPI.getAllOrders(user.token);
      setOrders(data);
    };
    user.role_id === 1 ? fetchOrders() : fetchOrderByUserId();
  }, []);

  return (
    <div className="bg-[#FFFFFF] p-4 rounded-lg shadow-md">
      {/* Tiêu đề */}
      <div className="flex flex-row justify-between items-center mb-4">
        <h1 className="text-[32px] font-bold ">Promotion List</h1>
      </div>

      <DataTable
        value={orders}
        paginator
        rows={10}
        showGridlines
        paginatorTemplate="PrevPageLink PageLinks NextPageLink"
      >
        <Column
          field="order_id"
          header="ID"
          sortable
          headerClassName="bg-[#d2d4d6]"
        />
        <Column
          field="Customer"
          header="Customer Name"
          sortable
          headerClassName="bg-[#d2d4d6]"
          body={customerBodyTemplate}
        />
        {user.role_id === 1 && (
          <Column
            field="User"
            header="Users ID"
            sortable
            headerClassName="bg-[#d2d4d6]"
            body={userBodyTemplate}
          />
        )}

        <Column
          field="promotion_id"
          header="Promotion ID"
          sortable
          headerClassName="bg-[#d2d4d6]"
        />
        <Column
          field="OrderStatus"
          header="Status"
          sortable
          headerClassName="bg-[#d2d4d6]"
          body={statusBodyTemplate}
        />
        <Column
          field="total"
          header="Total Amount"
          sortable
          headerClassName="bg-[#d2d4d6]"
          body={totalBodyTemplate}
        />
        <Column
          field="start_date"
          header="Start Date"
          sortable
          headerClassName="bg-[#d2d4d6]"
          body={createdAtBodyTemplate}
        />
        <Column
          body={(rowData) => (
            <div className="flex flex-row gap-2">
              <Link to={`/admin/order/edit/${rowData.order_id}`}>
                <button className="bg-green-500 text-white px-4 py-2 rounded">
                  Update
                </button>
              </Link>
            </div>
          )}
          headerStyle={{ width: "8rem", textAlign: "center" }}
          bodyStyle={{ textAlign: "center" }}
          headerClassName="bg-[#d2d4d6]"
        />
      </DataTable>
    </div>
  );
};

export default Order;
