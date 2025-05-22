import React, { useState } from 'react';

const sampleItems = [
  { product_id: 1, name: 'Sản phẩm A', price: 100, quantity: 2 },
  { product_id: 2, name: 'Sản phẩm B', price: 200, quantity: 1 },
];

function Checkout() {
  const [items] = useState(sampleItems);
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('vnpay');

  const subTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = 0;
  const shippingFee = 0;
  const total = subTotal - discount + shippingFee;

  const handleSubmit = () => {
    // Gọi API tạo đơn và thanh toán ở đây
    alert(`Đặt hàng với địa chỉ: ${shippingAddress} và phương thức: ${paymentMethod}`);
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 20, fontFamily: 'Arial, sans-serif' }}>
      <h2>Thanh toán</h2>

      <div>
        <h3>Giỏ hàng</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {items.map(item => (
            <li key={item.product_id} style={{ marginBottom: 10 }}>
              <strong>{item.name}</strong> — {item.quantity} x {item.price.toLocaleString()}₫ = {(item.price * item.quantity).toLocaleString()}₫
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginTop: 20 }}>
        <div>Subtotal: {subTotal.toLocaleString()}₫</div>
        <div>Giảm giá: {discount.toLocaleString()}₫</div>
        <div>Phí vận chuyển: {shippingFee.toLocaleString()}₫</div>
        <div style={{ fontWeight: 'bold', marginTop: 10 }}>Tổng cộng: {total.toLocaleString()}₫</div>
      </div>

      <div style={{ marginTop: 20 }}>
        <label>
          Địa chỉ giao hàng:<br />
          <textarea
            rows={3}
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            style={{ width: '100%', padding: 8 }}
            placeholder="Nhập địa chỉ nhận hàng"
          />
        </label>
      </div>

      <div style={{ marginTop: 20 }}>
        <label>
          Phương thức thanh toán:<br />
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            style={{ width: '100%', padding: 8 }}
          >
            <option value="vnpay">Thanh toán VNPay</option>
            <option value="momo">Thanh toán MoMo</option>
            <option value="cod">Thanh toán khi nhận hàng (COD)</option>
          </select>
        </label>
      </div>

      <button
        onClick={handleSubmit}
        style={{
          marginTop: 30,
          padding: '10px 20px',
          fontSize: 16,
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: 4,
          cursor: 'pointer'
        }}
      >
        Đặt hàng và Thanh toán
      </button>
    </div>
  );
}

export default Checkout;
