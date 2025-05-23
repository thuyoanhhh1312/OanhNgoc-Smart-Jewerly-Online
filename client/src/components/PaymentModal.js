import React from "react";
import { QRCodeCanvas } from "qrcode.react";

const PaymentModal = ({ show, onClose, name, bankAccount, amount, orderId }) => {
  if (!show) return null;

  // Tạo dữ liệu mã QR đơn giản, ví dụ string kết hợp
  const qrValue = `Người nhận: ${name}\nSố tài khoản: ${bankAccount}\nSố tiền đặt cọc: ${amount} VND\nMã đơn hàng: ${orderId}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-md max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">Thanh toán đặt cọc</h2>

        <p className="mb-2">Tên người nhận: {name}</p>
        <p className="mb-2">Số tài khoản: {bankAccount}</p>
        <p className="mb-2">Số tiền đặt cọc: {amount.toLocaleString()} VND</p>
        <p className="mb-4">Mã đơn hàng: {orderId}</p>

        <QRCodeCanvas value={qrValue} size={200} />

        <button
          className="mt-6 bg-blue-600 text-white px-4 py-2 rounded w-full"
          onClick={onClose}
        >
          Đóng
        </button>
      </div>
    </div>
  );
};

export default PaymentModal;
