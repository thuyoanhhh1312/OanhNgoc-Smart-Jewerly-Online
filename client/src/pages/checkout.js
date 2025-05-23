import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const CheckoutPage = () => {
  const location = useLocation();
  const { selectedItems = [], totalAmount = 0 } = location.state || {};
  const [gender, setGender] = useState(''); // 'male' or 'female'
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [sendCardSms, setSendCardSms] = useState(false);

  const [deliveryMethod, setDeliveryMethod] = useState('delivery'); // delivery or pickup
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [ward, setWard] = useState('');
  const [addressDetail, setAddressDetail] = useState('');

  const [receivePromo, setReceivePromo] = useState(false);
  const [invoiceRequest, setInvoiceRequest] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(true);

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [orderNote, setOrderNote] = useState('');

  // Bạn có thể load danh sách tỉnh/thành, quận/huyện, phường/xã từ API hoặc file json tùy chỉnh
  // Hiện demo tạm mảng giả lập
  const provinces = ['Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng'];
  const districts = ['Quận 1', 'Quận 2', 'Quận 3'];
  const wards = ['Phường A', 'Phường B', 'Phường C'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Vui lòng nhập họ và tên');
      return;
    }
    if (!phone.trim()) {
      alert('Vui lòng nhập số điện thoại');
      return;
    }
    if (deliveryMethod === 'delivery') {
      if (!province || !district || !ward || !addressDetail.trim()) {
        alert('Vui lòng nhập đầy đủ địa chỉ nhận hàng');
        return;
      }
    }

    // Xử lý gửi dữ liệu đặt hàng ở đây
    alert('Đặt hàng thành công (demo)!');
  };

  return (
    <div className="max-w-4xl mx-auto my-8 p-6 bg-white rounded shadow">
      <button
        onClick={() => window.history.back()}
        className="mb-4 text-blue-700 font-semibold flex items-center gap-1"
      >
        ← Quay lại
      </button>

      <h2 className="text-center text-lg font-bold mb-6">Thông tin đặt hàng</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Danh sách sản phẩm được chọn */}
        <div className="border p-4 rounded space-y-4">
          <h3 className="font-semibold mb-2">Sản phẩm đã chọn</h3>
          {selectedItems.map((item) => (
            <div key={item.product_id} className="flex gap-4 items-center border-b pb-3">
              <img
                src={item.ProductImages?.[0]?.image_url || 'https://via.placeholder.com/80'}
                alt={item.product_name}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <p className="font-semibold">{item.product_name}</p>
                <p className="text-sm text-gray-600">Mã: {item.product_code}</p>
                <p className="mt-1">
                  Số lượng: <b>{item.count}</b>
                </p>
                <p className="text-yellow-700 font-semibold">
                  Đơn giá: {item.price.toLocaleString('vi-VN')} đ
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mã ưu đãi */}
        <div className="border p-4 rounded">
          <input type="text" placeholder="Nhập mã ưu đãi" className="w-full border rounded p-2" />
          <button type="button" className="mt-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
            Áp dụng
          </button>
        </div>

        {/* Tạm tính */}
        <div className="border p-4 rounded space-y-1 text-sm">
          <p>
            Tạm tính{' '}
            <span className="float-right font-semibold">
              {totalAmount.toLocaleString('vi-VN')} đ
            </span>
          </p>
          <p>
            Giao hàng{' '}
            <span className="float-right text-blue-600 cursor-pointer font-semibold">Miễn phí</span>
          </p>
          <p>
            Giảm giá <span className="float-right font-semibold">- 0 đ</span>
          </p>
          <p className="border-t pt-1">
            Tổng tiền{' '}
            <span className="float-right font-semibold">
              {totalAmount.toLocaleString('vi-VN')} đ
            </span>
          </p>
          <p className="text-xs text-gray-500">(Giá tham khảo đã bao gồm VAT)</p>
        </div>

        {/* Thông tin người mua */}
        <div>
          <p className="font-semibold mb-2">Thông tin người mua</p>

          <div className="flex gap-4 mb-2">
            <label className="inline-flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={gender === 'female'}
                onChange={() => setGender('female')}
              />
              Chị
            </label>
            <label className="inline-flex items-center gap-1 cursor-pointer">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={gender === 'male'}
                onChange={() => setGender('male')}
              />
              Anh
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              required
              type="text"
              placeholder="Họ và tên *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded p-2"
            />
            <input
              type="tel"
              placeholder="Số điện thoại *"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border rounded p-2"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border rounded p-2 col-span-2"
            />
            <input
              type="date"
              placeholder="Ngày sinh"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="border rounded p-2 col-span-2"
            />
          </div>

          <label className="inline-flex items-center gap-2 mt-2 cursor-pointer">
            <input
              type="checkbox"
              checked={sendCardSms}
              onChange={(e) => setSendCardSms(e.target.checked)}
            />
            Tôi muốn gửi thiệp và lời chúc qua SMS
          </label>
        </div>

        {/* Hình thức nhận hàng */}
        <div className="mt-4 border rounded p-4">
          <p className="font-semibold mb-4">Hình thức nhận hàng</p>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setDeliveryMethod('delivery')}
              className={`border p-3 rounded flex items-center gap-2 cursor-pointer ${
                deliveryMethod === 'delivery' ? 'bg-yellow-50' : ''
              }`}
            >
              <img
                src="https://cdn.pnj.io/images/2023/relayout-pdp/shipping_icon.png"
                alt="Giao hàng tận nơi"
                className="w-6 h-6"
              />
              <div>
                <p className="font-semibold">Giao hàng tận nơi</p>
                <p className="text-xs text-gray-500">Miễn phí toàn quốc</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setDeliveryMethod('pickup')}
              className={`border p-3 rounded flex items-center gap-2 cursor-pointer ${
                deliveryMethod === 'pickup' ? 'bg-yellow-50' : ''
              }`}
            >
              <img
                src="https://cdn.pnj.io/images/2023/relayout-pdp/shipping_icon_2.png"
                alt="Nhận tại cửa hàng"
                className="w-6 h-6"
              />
              <div>
                <p className="font-semibold">Nhận tại cửa hàng</p>
              </div>
            </button>
          </div>

          {/* Địa chỉ nhận hàng nếu chọn giao hàng tận nơi */}
          {deliveryMethod === 'delivery' && (
            <div className="mt-4 grid grid-cols-2 gap-4">
              <select
                required
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="border p-2 rounded"
              >
                <option value="">Chọn tỉnh/thành *</option>
                {provinces.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>

              <select
                required
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                className="border p-2 rounded"
              >
                <option value="">Quận/huyện *</option>
                {districts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>

              <select
                required
                value={ward}
                onChange={(e) => setWard(e.target.value)}
                className="border p-2 rounded"
              >
                <option value="">Phường/xã *</option>
                {wards.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>

              <input
                required
                type="text"
                placeholder="Nhập địa chỉ khách hàng *"
                value={addressDetail}
                onChange={(e) => setAddressDetail(e.target.value)}
                className="border p-2 rounded"
              />
            </div>
          )}
        </div>

        {/* Các checkbox đồng ý */}
        <div className="mt-4 space-y-2 text-sm">
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={receivePromo}
              onChange={(e) => setReceivePromo(e.target.checked)}
            />
            Đồng ý nhận các thông tin và chương trình khuyến mãi của PNJ qua email, SMS, mạng xã hội
          </label>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={invoiceRequest}
              onChange={(e) => setInvoiceRequest(e.target.checked)}
            />
            Xuất hóa đơn công ty (Không áp dụng phiếu quà tặng điện tử)
          </label>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={agreePrivacy}
              onChange={(e) => setAgreePrivacy(e.target.checked)}
            />
            Tôi đồng ý cho PNJ thu thập, xử lý dữ liệu cá nhân của tôi theo quy định tại{' '}
            <a
              href="https://www.pnj.com.vn/thong-bao-4"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600"
            >
              Thông báo này
            </a>{' '}
            và theo quy định của pháp luật
          </label>
        </div>

        {/* Phương thức thanh toán */}
        <div className="mt-6">
          <p className="font-semibold mb-2">Phương thức thanh toán</p>
          <ul className="space-y-2 text-sm">
            <li
              className={`border p-2 rounded cursor-pointer ${
                paymentMethod === 'cod' ? 'border-blue-600' : ''
              }`}
              onClick={() => setPaymentMethod('cod')}
            >
              Thanh toán tiền mặt khi nhận hàng (COD)
            </li>
            <li
              className={`border p-2 rounded cursor-pointer ${
                paymentMethod === 'bank_transfer' ? 'border-blue-600' : ''
              }`}
              onClick={() => setPaymentMethod('bank_transfer')}
            >
              Thanh toán chuyển khoản
            </li>

            <li
              className={`border p-2 rounded cursor-pointer ${
                paymentMethod === 'qr_code' ? 'border-blue-600' : ''
              }`}
              onClick={() => setPaymentMethod('qr_code')}
            >
              Quét mã QR
            </li>
          </ul>
        </div>

        {/* Ghi chú đơn hàng */}
        <div className="mt-6">
          <label className="font-semibold mb-2 block">Ghi chú đơn hàng (Không bắt buộc)</label>
          <textarea
            rows={4}
            placeholder="Vui lòng ghi chú thêm để PNJ có thể hỗ trợ tốt nhất cho Quý khách!"
            className="w-full border p-2 rounded resize-none"
            value={orderNote}
            onChange={(e) => setOrderNote(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full mt-8 bg-[#003468] text-white rounded-lg py-3 font-bold"
        >
          ĐẶT HÀNG
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;
