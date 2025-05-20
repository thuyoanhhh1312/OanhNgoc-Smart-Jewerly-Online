import React, { useEffect, useState } from "react";
import Input from "../../../components/form/input/InputField";
import Label from "../../../components/form/Label";
import Button from "../../../components/ui/button/Button";
import * as UserAPI from "../../../api/userApi";
import OrderAPI from "../../../api/orderApi";
import OrderStatusAPI from "../../../api/orderStatusApi";
import { useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

const EditOrder = () => {
  const { user } = useSelector((state) => ({ ...state }));
  const { id } = useParams();

  // State form
  const [orderCode, setOrderCode] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [staffId, setStaffId] = useState("");
  const [statusId, setStatusId] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [promotionCode, setPromotionCode] = useState("");

  // Danh sách nhân viên và trạng thái
  const [staffList, setStaffList] = useState([]);
  const [statusList, setStatusList] = useState([]);

  const navigate = useNavigate();

  // Kiểm tra quyền user
  const isAdmin = user?.role_id === 1;
  const isStaffOrAdmin = user?.role_id === 1 || user?.role_id === 3;
  // Lấy danh sách nhân viên
  const fetchStaffList = async () => {
    try {
      const staffData = await UserAPI.getUsers();
      setStaffList(staffData);
    } catch (error) {
      console.error("Lỗi lấy danh sách nhân viên:", error);
    }
  };

  // Lấy danh sách trạng thái đơn hàng
  const fetchStatusList = async () => {
    try {
      const statusData = await OrderStatusAPI.getOrderStatus();
      setStatusList(statusData);
    } catch (error) {
      console.error("Lỗi lấy danh sách trạng thái:", error);
    }
  };

  // Lấy dữ liệu đơn hàng
  const fetchOrder = async () => {
    try {
      const orderData = await OrderAPI.getOrderById(id, user.token);
      setOrderCode(orderData.order_id || "");
      setCustomerName(orderData.Customer?.name || "");
      setStaffId(orderData.user_id || "");
      setStatusId(orderData.status_id || "");
      setTotalAmount(orderData.total || 0);
      setPromotionCode(orderData.Promotion?.promotion_code || "");
    } catch (error) {
      console.error("Lỗi lấy thông tin đơn hàng:", error);
    }
  };

  // Load nhân viên và trạng thái khi mount
  useEffect(() => {
    fetchStaffList();
    fetchStatusList();
  }, []);

  // Load đơn hàng sau khi có statusList (để set đúng)
  useEffect(() => {
    if (statusList.length > 0) {
      fetchOrder();
    }
  }, [id, statusList]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Chỉ admin mới được update nhân viên xử lý
      if (isAdmin) {
        await OrderAPI.updateStaff(id, staffId, user.token);
      }
      // Admin và staff mới được update trạng thái đơn hàng
      if (isStaffOrAdmin) {
        await OrderAPI.updateOrder(id, statusId, user.token);
      }

      await Swal.fire({
        icon: "success",
        title: "Cập nhật thành công!",
        text: "Đơn hàng đã được cập nhật.",
        confirmButtonText: "OK",
      });

      navigate("/admin/orders");
    } catch (error) {
      console.error("Lỗi cập nhật đơn hàng:", error);
      Swal.fire({
        icon: "error",
        title: "Lỗi",
        text: "Đã xảy ra lỗi khi cập nhật đơn hàng!",
      });
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <form onSubmit={handleSubmit} method="POST">
          <div className="space-y-6">
            <div>
              <Label>
                Mã đơn hàng <span className="text-red">*</span>
              </Label>
              <Input
                type="text"
                name="Mã Đơn Hàng"
                id="order_code"
                value={orderCode}
                readOnly
                disabled
              />
            </div>

            <div>
              <Label>
                Tên khách hàng <span className="text-red">*</span>
              </Label>
              <Input
                type="text"
                name="Tên Khách Hàng"
                id="customer_name"
                value={customerName}
                readOnly
                disabled
              />
            </div>

            <div>
              <Label>
                Nhân viên xử lý <span className="text-red">*</span>
              </Label>
              <select
                name="Tên Nhân Viên"
                id="staff_id"
                value={staffId}
                onChange={(e) => setStaffId(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
                disabled={!isAdmin} // Chỉ admin được chỉnh sửa
              >
                <option value="" disabled>
                  -- Chọn nhân viên --
                </option>
                {staffList.map((staff) => (
                  <option key={staff.id} value={staff.id}>
                    {staff.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label>
                Trạng thái đơn hàng <span className="text-red">*</span>
              </Label>
              <select
                name="Trạng Thái"
                id="status_id"
                value={statusId}
                onChange={(e) => setStatusId(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                required
                disabled={!isStaffOrAdmin} // Admin và staff được chỉnh sửa
              >
                <option value="" disabled>
                  -- Chọn trạng thái --
                </option>
                {statusList.map((status) => (
                  <option key={status.status_id} value={status.status_id}>
                    {status.status_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label>
                Giá trị đơn hàng <span className="text-red">*</span>
              </Label>
              <Input
                type="number"
                name="Giá Trị Đơn Hàng"
                id="total_amount"
                value={totalAmount}
                readOnly
                disabled
              />
            </div>

            <div>
              <Label>Mã khuyến mãi</Label>
              <Input
                type="text"
                name="Mã Khuyến Mãi"
                id="promotion_code"
                value={promotionCode}
                readOnly
                disabled
              />
            </div>

            <div className="flex items-center justify-between">
              <Button
                type="submit"
                className="w-full py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                disabled={!isStaffOrAdmin} // Nếu không phải admin hoặc staff thì disable nút cập nhật
              >
                Cập nhật đơn hàng
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditOrder;
