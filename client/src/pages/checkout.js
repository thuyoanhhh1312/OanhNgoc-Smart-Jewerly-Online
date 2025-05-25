import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Stack,
  FormControlLabel,
  Checkbox,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  Select,
  Menu, MenuItem
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import { QRCodeSVG } from "qrcode.react";
import MainLayout from "../layout/MainLayout";
import orderApi from "../api/orderApi";
import { QRPay, BanksObject } from "vietnam-qr-pay";
import "react-toastify/dist/ReactToastify.css";

const provinces = ["Hà Nội", "Hồ Chí Minh", "Đà Nẵng"];
const districts = ["Quận 1", "Quận 2", "Quận 3"];
const wards = ["Phường A", "Phường B", "Phường C"];

// Thông tin ngân hàng MB Bank
const BANK_NAME = "MB Bank";
const BANK_CODE = BanksObject.mbbank.bin; // MBBank
const BANK_ACCOUNT = "0792360150";

// Thông tin tài khoản ví MoMo của bạn
const MOMO_ACCOUNT = "99MM24030M03578011";
// Thông tin tài khoản ví ZaloPay của bạn
const ZALOPAY_ACCOUNT = "99ZP24187M32217896";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedItems = [], totalAmount = 0 } = location.state || {};

  const [gender, setGender] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [sendCardSms, setSendCardSms] = useState(false);

  const [deliveryMethod, setDeliveryMethod] = useState("delivery");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [addressDetail, setAddressDetail] = useState("");

  const [promoCode, setPromoCode] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoResult, setPromoResult] = useState({ valid: false, message: "", discount: 0 });

  const [receivePromo, setReceivePromo] = useState(false);
  const [invoiceRequest, setInvoiceRequest] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(true);

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [orderNote, setOrderNote] = useState("");

  const [subTotal, setSubTotal] = useState(totalAmount || 0);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(totalAmount || 0);

  const [submitting, setSubmitting] = useState(false);
  const [qrValue, setQrValue] = useState("");

  const validateForm = () => {
    if (!name.trim()) {
      toast.error("Vui lòng nhập họ và tên.");
      return false;
    }
    if (!phone.trim()) {
      toast.error("Vui lòng nhập số điện thoại.");
      return false;
    }
    if (deliveryMethod === "delivery") {
      if (!province) {
        toast.error("Vui lòng chọn tỉnh/thành.");
        return false;
      }
      if (!district) {
        toast.error("Vui lòng chọn quận/huyện.");
        return false;
      }
      if (!ward) {
        toast.error("Vui lòng chọn phường/xã.");
        return false;
      }
      if (!addressDetail.trim()) {
        toast.error("Vui lòng nhập địa chỉ chi tiết.");
        return false;
      }
    }
    if (!agreePrivacy) {
      toast.error("Bạn phải đồng ý với chính sách bảo mật.");
      return false;
    }
    return true;
  };

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      toast.warn("Vui lòng nhập mã ưu đãi.");
      setDiscount(0);
      setTotal(subTotal);
      setPromoResult({ valid: false, message: "", discount: 0 });
      return;
    }
    setPromoLoading(true);
    try {
      const priceData = {
        items: selectedItems.map((item) => ({
          product_id: item.product_id,
          quantity: item.count,
        })),
        promotion_code: promoCode.trim(),
      };
      const res = await orderApi.calculatePrice(priceData, localStorage.getItem("accessToken"));
      if (res.valid) {
        setDiscount(res.discount);
        setTotal(res.total);
        toast.success(res.message);
      } else {
        setDiscount(0);
        setTotal(subTotal);
        toast.error(res.message);
      }
      setPromoResult(res);
    } catch (err) {
      toast.error("Lỗi khi áp dụng mã ưu đãi.");
      setDiscount(0);
      setTotal(subTotal);
      setPromoResult({ valid: false, message: "", discount: 0 });
    } finally {
      setPromoLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (selectedItems.length === 0) {
      toast.error("Không có sản phẩm nào trong đơn hàng.");
      return;
    }

    setSubmitting(true);
    try {
      const orderData = {
        customer_id: 1, // TODO: Lấy customer_id thực tế (đăng nhập)
        user_id: null,
        promotion_code: promoResult.valid ? promoCode.trim() : null,
        payment_method: paymentMethod,
        shipping_address:
          deliveryMethod === "delivery"
            ? `${addressDetail}, ${ward}, ${district}, ${province}`
            : "Nhận tại cửa hàng",
        is_deposit: false,
        deposit_status: "none",
        items: selectedItems.map((item) => ({
          product_id: item.product_id,
          quantity: item.count,
          price: item.price,
        })),
      };
      const res = await orderApi.checkout(orderData, localStorage.getItem("accessToken"));
      toast.success("Đặt hàng thành công! Mã đơn hàng: " + res.order.order_id);
      navigate("/order-success", { state: { order: res.order } });
    } catch (error) {
      toast.error(
        "Lỗi khi đặt hàng: " +
        (error.response?.data?.message || error.message || "Vui lòng thử lại sau.")
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Tạo QR code string
  useEffect(() => {
    let amount = 0;
    if (paymentMethod === "cod") {
      amount = Math.round(subTotal * 0.1); // 10% tổng tiền
    } else if (paymentMethod === "momo" || paymentMethod === "ck") {
      amount = Math.round(total); // 100% tổng tiền
    }

    let qrStr = "";

    if (paymentMethod === "cod") {
      // QR VietQR ngân hàng MB Bank
      const qrPay = QRPay.initVietQR({
        bankBin: BANK_CODE,
        bankNumber: BANK_ACCOUNT,
        amount: amount.toString(),
        purpose: "Thanh toán đặt cọc PNJ",
      });
      qrStr = qrPay.build();
    } else if (paymentMethod === "momo") {
      // QR VietQR MoMo
      const momoQR = QRPay.initVietQR({
        bankBin: BanksObject.banviet.bin, // Mã ngân hàng ví MoMo (Ban Viet)
        bankNumber: MOMO_ACCOUNT,
        amount: amount.toString(),
        purpose: "Thanh toán đơn hàng PNJ qua MoMo",
      });
      // Thêm tham chiếu giao dịch (tùy chọn)
      momoQR.additionalData.reference = "MOMOW2W" + MOMO_ACCOUNT.slice(-3);
      momoQR.setUnreservedField("80", "046"); // VD 3 số cuối điện thoại người nhận
      qrStr = momoQR.build();
    } else if (paymentMethod === "ck") {
      const qrPay = QRPay.initVietQR({
        bankBin: BANK_CODE,
        bankNumber: BANK_ACCOUNT,
        amount: amount.toString(),
        purpose: "Thanh toán đặt cọc PNJ",
      });
      qrStr = qrPay.build();
    }

    setQrValue(qrStr);
  }, [paymentMethod, subTotal, total]);

  return (
    <MainLayout>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          maxWidth: 1200,
          width: "100%",
          mx: "auto",
          my: 5,
          p: 4,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 3,
          color: "text.primary",
        }}
      >
        <ToastContainer position="top-right" autoClose={3000} />
        <Button
          onClick={() => navigate(-1)}
          sx={{ mb: 3, color: "primary.main", fontWeight: "bold" }}
        >
          ← Quay lại
        </Button>
        <Typography variant="h5" fontWeight="bold" mb={4} color="primary.main" align="center">
          Thông tin đặt hàng
        </Typography>
        {/* Sản phẩm đã chọn */}
        <Box mb={4} borderRadius={1} p={2} sx={{ border: 1, borderColor: "divider" }}>
          <Typography
            variant="h6"
            fontWeight="bold"
            color="text.primary"
            gutterBottom
          >
            Sản phẩm đã chọn
          </Typography>
          {selectedItems.length === 0 && (
            <Typography color="text.secondary">Không có sản phẩm nào.</Typography>
          )}
          {selectedItems.map((item) => (
            <Box
              key={item.product_id}
              display="flex"
              alignItems="center"
              borderBottom={1}
              borderColor="divider"
              pb={1}
              mb={1}
              sx={{ "&:last-child": { borderBottom: "none", mb: 0, pb: 0 } }}
            >
              <img
                src={item.ProductImages?.[0]?.image_url || "https://via.placeholder.com/80"}
                alt={item.product_name}
                width={64}
                height={64}
                style={{ objectFit: "cover", borderRadius: 4 }}
              />
              <Box ml={2}>
                <Typography fontWeight="bold" color="text.primary">
                  {item.product_name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Mã: {item.product_code}
                </Typography>
                <Typography variant="body2" mt={0.5} color="text.primary">
                  Số lượng: <strong>{item.count}</strong>
                </Typography>
                <Typography variant="body2" fontWeight="bold" color="primary.main" mt={0.5}>
                  Đơn giá: {item.price.toLocaleString("vi-VN")} đ
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>


        {/* --- Chỗ này bạn có thể thêm phần nhập thông tin khách hàng, địa chỉ, ... --- */}

        {/* Mã ưu đãi */}
        <Box mb={4}>
          <TextField
            label="Mã ưu đãi"
            fullWidth
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            disabled={promoLoading}
            InputProps={{
              endAdornment: promoLoading ? (
                <CircularProgress size={20} />
              ) : (
                <Button size="small" onClick={handleApplyPromo} disabled={promoLoading} sx={{ color: "primary.main", fontWeight: "bold" }}>
                  Áp dụng
                </Button>
              ),
            }}
            helperText={promoResult.message}
            error={!promoResult.valid && promoResult.message !== ""}
          />
        </Box>

        {/* Tổng tiền */}
        <Box
          mb={4}
          p={2}
          borderRadius={1}
          sx={{ border: 1, borderColor: "divider" }}
          color="text.primary"
          fontWeight="bold"
        >
          <Typography display="flex" justifyContent="space-between" mb={1}>
            <span>Tạm tính</span>
            <span>{subTotal.toLocaleString("vi-VN")} đ</span>
          </Typography>
          <Typography display="flex" justifyContent="space-between" mb={1}>
            <span>Giảm giá</span>
            <span style={{ color: "#d32f2f" }}>- {discount.toLocaleString("vi-VN")} đ</span>
          </Typography>
          <Typography
            display="flex"
            justifyContent="space-between"
            borderTop={1}
            borderColor="divider"
            pt={1}
            fontSize="1.2rem"
          >
            <span>Tổng tiền</span>
            <span>{total.toLocaleString("vi-VN")} đ</span>
          </Typography>
          <Typography fontSize="0.75rem" fontStyle="italic" mt={1} color="text.secondary">
            (Giá tham khảo đã bao gồm VAT)
          </Typography>
        </Box>

        {/* Thông tin người mua */}
        <Box mb={4}>
          <FormControl component="fieldset" sx={{ mb: 2 }}>
            <FormLabel component="legend" sx={{ color: "text.primary" }}>
              Giới tính
            </FormLabel>
            <RadioGroup
              row
              name="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              sx={{ color: "text.primary" }}
            >
              <FormControlLabel value="female" control={<Radio />} label="Chị" />
              <FormControlLabel value="male" control={<Radio />} label="Anh" />
            </RadioGroup>
          </FormControl>

          <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
            <TextField
              required
              label="Họ và tên"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />
            <TextField
              required
              label="Số điện thoại"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              fullWidth
            />
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              sx={{ gridColumn: "span 2" }}
            />
            <TextField
              label="Ngày sinh"
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
              sx={{ gridColumn: "span 2" }}
            />
          </Box>

          <FormControlLabel
            control={
              <Checkbox
                checked={sendCardSms}
                onChange={(e) => setSendCardSms(e.target.checked)}
                sx={{ color: "primary.main" }}
              />
            }
            label="Tôi muốn gửi thiệp và lời chúc qua SMS"
            sx={{ mt: 2, color: "text.primary" }}
          />
        </Box>

        {/* Hình thức nhận hàng */}
        <Box mb={4}>
          <Typography variant="h6" sx={{ color: "text.primary", mb: 2 }}>
            Hình thức nhận hàng
          </Typography>
          <Box display="flex" gap={2} flexWrap="wrap">
            <Button
              variant={deliveryMethod === "delivery" ? "contained" : "outlined"}
              color="primary"
              startIcon={
                <img
                  src="https://cdn.pnj.io/images/2023/relayout-pdp/shipping_icon.png"
                  alt="Giao hàng tận nơi"
                  width={24}
                  height={24}
                  style={{ objectFit: "contain" }}
                />
              }
              onClick={() => setDeliveryMethod("delivery")}
              sx={{ flexGrow: 1, minWidth: 150 }}
            >
              Giao hàng tận nơi
            </Button>
            <Button
              variant={deliveryMethod === "pickup" ? "contained" : "outlined"}
              color="primary"
              startIcon={
                <img
                  src="https://cdn.pnj.io/images/2023/relayout-pdp/shipping_icon_2.png"
                  alt="Nhận tại cửa hàng"
                  width={24}
                  height={24}
                  style={{ objectFit: "contain" }}
                />
              }
              onClick={() => setDeliveryMethod("pickup")}
              sx={{ flexGrow: 1, minWidth: 150 }}
            >
              Nhận tại cửa hàng
            </Button>
          </Box>

          {deliveryMethod === "delivery" && (
            <Box
              mt={3}
              display="grid"
              gridTemplateColumns="repeat(2, 1fr)"
              gap={2}
              maxWidth={480}
            >
              <FormControl fullWidth required>
                <Select
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  displayEmpty
                  sx={{ color: province ? "inherit" : "text.secondary" }}
                >
                  <MenuItem disabled value="">
                    Chọn tỉnh/thành *
                  </MenuItem>
                  {provinces.map((p) => (
                    <MenuItem key={p} value={p}>
                      {p}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth required>
                <Select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  displayEmpty
                  sx={{ color: district ? "inherit" : "text.secondary" }}
                >
                  <MenuItem disabled value="">
                    Quận/huyện *
                  </MenuItem>
                  {districts.map((d) => (
                    <MenuItem key={d} value={d}>
                      {d}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth required>
                <Select
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  displayEmpty
                  sx={{ color: ward ? "inherit" : "text.secondary" }}
                >
                  <MenuItem disabled value="">
                    Phường/xã *
                  </MenuItem>
                  {wards.map((w) => (
                    <MenuItem key={w} value={w}>
                      {w}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                required
                label="Địa chỉ chi tiết *"
                value={addressDetail}
                onChange={(e) => setAddressDetail(e.target.value)}
                fullWidth
              />
            </Box>
          )}
        </Box>

        {/* Phương thức thanh toán */}
        <Box mb={4}>
          <Typography variant="h6" gutterBottom color="text.primary">
            Phương thức thanh toán
          </Typography>
          <Stack spacing={1}>
            <Button
              variant={paymentMethod === "cod" ? "contained" : "outlined"}
              color="primary"
              onClick={() => setPaymentMethod("cod")}
              fullWidth
              sx={{ justifyContent: "flex-start" }}
            >
              Thanh toán tiền mặt khi nhận hàng (COD)
            </Button>
            <Button
              variant={paymentMethod === "momo" ? "contained" : "outlined"}
              color="primary"
              onClick={() => setPaymentMethod("momo")}
              fullWidth
              sx={{ justifyContent: "flex-start" }}
            >
              Thanh toán bằng MoMo
            </Button>
            <Button
              variant={paymentMethod === "ck" ? "contained" : "outlined"}
              color="primary"
              onClick={() => setPaymentMethod("ck")}
              fullWidth
              sx={{ justifyContent: "flex-start" }}
            >
              Thanh toán bằng ngân hàng
            </Button>
          </Stack>
          {(paymentMethod === "cod" || paymentMethod === "momo" || paymentMethod === "ck") && (
            <Box
              mt={3}
              p={2}
              borderRadius={2}
              border="0px solid"
              borderColor="primary.main"
              textAlign="center"
              maxWidth={300}
              mx="auto"
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* <Typography variant="subtitle1" color="primary.main" fontWeight="bold" mb={1}>
                Mã QR thanh toán
              </Typography> */}
              <QRCodeSVG value={qrValue} size={180} />
              <Typography mt={1} fontWeight="medium" color="text.primary">
                Số tiền:{" "}
                <strong>
                  {paymentMethod === "cod"
                    ? Math.round(subTotal * 0.1).toLocaleString("vi-VN")
                    : Math.round(total).toLocaleString("vi-VN")}{" "}
                  đ
                </strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {paymentMethod === "momo"
                  ? "Ví MoMo"
                  : paymentMethod === "ck"
                    ? BANK_NAME
                    : BANK_NAME}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={1}>
                {paymentMethod === "momo"
                  ? MOMO_ACCOUNT
                  : paymentMethod === "ck"
                    ? BANK_ACCOUNT
                    : BANK_ACCOUNT}
              </Typography>
            </Box>
          )}
        </Box>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          disabled={submitting}
        >
          {submitting ? <CircularProgress size={24} sx={{ color: "white" }} /> : "ĐẶT HÀNG"}
        </Button>
      </Box>
    </MainLayout>
  );
};

export default CheckoutPage;