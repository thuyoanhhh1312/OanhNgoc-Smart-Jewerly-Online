// components/AddToCartModal.js
import React, { useState } from 'react';

const AddToCartModal = ({ product, onClose, onConfirm }) => {
  const [quantity, setQuantity] = useState(1);

  const handleConfirm = () => {
    onConfirm(quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white p-5 rounded-lg max-w-sm w-full">
        <h3 className="text-lg font-bold mb-3">Thêm vào giỏ hàng</h3>
        <div className="flex items-center gap-4">
          <img
            src={product?.ProductImages?.[0]?.image_url || ""}
            alt={product?.product_name}
            className="w-20 h-20 object-cover rounded border"
          />
          <div>
            <p className="font-semibold">{product?.product_name}</p>
            <p className="text-yellow-700">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(product?.price)}
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          <span>Số lượng:</span>
          <input
            type="number"
            value={quantity}
            min={1}
            className="border rounded w-16 px-2"
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-2 bg-gray-300 rounded">Hủy</button>
          <button onClick={handleConfirm} className="px-4 py-2 bg-blue-600 text-white rounded">Xác nhận</button>
        </div>
      </div>
    </div>
  );
};

export default AddToCartModal;
