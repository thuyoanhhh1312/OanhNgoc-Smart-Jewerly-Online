import React, { useState, useEffect } from 'react';
import PaymentModal from '../components/PaymentModal';
import { createOrder } from '../api/orderApi';

const OrderPage = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState(0);
  const [orderId, setOrderId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [hasPaidDeposit, setHasPaidDeposit] = useState(false); // Người mua tick xác nhận đã chuyển cọc

  useEffect(() => {
    const storedTotal = localStorage.getItem('totalAmount');
    if (storedTotal) {
      setTotalAmount(Number(storedTotal));
    } else {
      setTotalAmount(0);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // reset lỗi trước khi kiểm tra

    if (!name.trim()) {
      setErrorMessage('Vui lòng nhập họ tên');
      return;
    }
    if (!bankAccount.trim()) {
      setErrorMessage('Vui lòng nhập số tài khoản ngân hàng');
      return;
    }
    if (totalAmount <= 0) {
      setErrorMessage('Tổng tiền đơn hàng không hợp lệ');
      return;
    }

    const deposit = +(totalAmount * 0.1).toFixed(0);
    setDepositAmount(deposit);

    if (totalAmount > 3000000 && !hasPaidDeposit) {
      setErrorMessage('Bạn phải chuyển cọc 10% trước khi đặt đơn hàng trên 3 triệu.');
      return;
    }

    try {
      const orderData = {
        name: name.trim(),
        phone: phone.trim(),
        bankAccount: bankAccount.trim(),
        total: totalAmount,
        deposit,
        hasPaidDeposit, // lưu trạng thái xác nhận cọc
        status: hasPaidDeposit ? 'waiting_for_deposit_confirmation' : 'pending_payment', // trạng thái đơn hàng tùy xác nhận cọc
      };

      const createdOrder = await createOrder(orderData);
      setOrderId(createdOrder.order_id);
      setShowModal(true);
    } catch (error) {
      setErrorMessage('Lỗi tạo đơn hàng, vui lòng thử lại');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Đặt hàng</h2>

      {errorMessage && (
        <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{errorMessage}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Họ và tên *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <input
          type="text"
          placeholder="Số điện thoại"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border p-2 w-full"
        />
        <input
          type="text"
          placeholder="Số tài khoản ngân hàng *"
          value={bankAccount}
          onChange={(e) => setBankAccount(e.target.value)}
          className="border p-2 w-full"
          required
        />

        {totalAmount > 3000000 && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="paid-deposit"
              checked={hasPaidDeposit}
              onChange={(e) => setHasPaidDeposit(e.target.checked)}
            />
            <label htmlFor="paid-deposit" className="select-none">
              Tôi đã chuyển cọc 10% tổng đơn hàng
            </label>
          </div>
        )}

        <p className="font-semibold">Tổng tiền: {totalAmount.toLocaleString()} đ</p>
        <p className="text-sm italic text-gray-600 mb-2">
          {totalAmount > 3000000
            ? 'Bạn phải thanh toán đặt cọc 10% tổng đơn hàng để xác nhận.'
            : 'Đơn hàng dưới 3 triệu không cần đặt cọc.'}
        </p>

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">
          Thanh toán đặt cọc 10%
        </button>
      </form>

      <PaymentModal
        show={showModal}
        onClose={() => setShowModal(false)}
        name={name}
        bankAccount={bankAccount}
        amount={depositAmount}
        orderId={orderId}
      />
    </div>
  );
};

export default OrderPage;
