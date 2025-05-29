import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Stack,
  FormControl,
  Select,
  MenuItem,
} from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import { QRCodeSVG } from 'qrcode.react';
import MainLayout from '../layout/MainLayout';
import orderApi from '../api/orderApi';
import { QRPay, BanksObject } from 'vietnam-qr-pay';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector, useDispatch } from 'react-redux';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import { getProvinces, getDistricts, getWards } from '../api/vietnamLocationApi';

// Thông tin ngân hàng MB Bank
const BANK_NAME = 'MB Bank';
const BANK_CODE = BanksObject.mbbank.bin;
const BANK_ACCOUNT = '0816837690';

// Thông tin tài khoản ví MoMo của bạn
const MOMO_ACCOUNT = '99MM23332M53758772';

const CheckoutPage = () => {
  const { user } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedItems = [], totalAmount = 0 } = location.state || {};

  // Địa chỉ giao hàng động
  const [deliveryMethod, setDeliveryMethod] = useState('delivery');
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [ward, setWard] = useState('');
  const [addressDetail, setAddressDetail] = useState('');

  // Danh sách tỉnh, huyện, xã từ API
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  // Mã khuyến mãi
  const [promoCode, setPromoCode] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoResult, setPromoResult] = useState({
    valid: false,
    message: '',
    discount: 0,
    promotion: null,
  });

  // Thanh toán
  const [paymentMethod, setPaymentMethod] = useState('cod');

  // Tính tiền
  const [subTotal, setSubTotal] = useState(totalAmount || 0);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(totalAmount || 0);

  // Gửi đơn hàng
  const [submitting, setSubmitting] = useState(false);
  const [qrValue, setQrValue] = useState('');

  // Thông tin mã ưu đãi hiển thị
  const promoInfo = promoResult.valid && promoResult.promotion;

  // Load danh sách tỉnh/thành lúc mount
  useEffect(() => {
    async function fetchProvincesData() {
      try {
        const data = await getProvinces();
        setProvinces(data);
      } catch (error) {
        toast.error('Lỗi khi tải danh sách tỉnh/thành');
      }
    }
    fetchProvincesData();
  }, []);

  // Load danh sách quận/huyện khi chọn tỉnh thay đổi
  useEffect(() => {
    async function fetchDistrictsData() {
      if (!province) {
        setDistricts([]);
        setDistrict('');
        setWards([]);
        setWard('');
        return;
      }
      try {
        const data = await getDistricts(province);
        setDistricts(data);
        setDistrict('');
        setWards([]);
        setWard('');
      } catch (error) {
        toast.error('Lỗi khi tải danh sách quận/huyện');
      }
    }
    fetchDistrictsData();
  }, [province]);

  // Load danh sách phường/xã khi chọn quận thay đổi
  useEffect(() => {
    async function fetchWardsData() {
      if (!district) {
        setWards([]);
        setWard('');
        return;
      }
      try {
        const data = await getWards(district);
        setWards(data);
        setWard('');
      } catch (error) {
        toast.error('Lỗi khi tải danh sách phường/xã');
      }
    }
    fetchWardsData();
  }, [district]);

  // Hàm giúp tìm tên theo code trong danh sách
  function findNameByCode(list, code) {
    const found = list.find((item) => item.code === code);
    return found ? found.name : '';
  }

  // Xác thực form
  const validateForm = () => {
    if (deliveryMethod === 'delivery') {
      if (!province) {
        toast.error('Vui lòng chọn tỉnh/thành.');
        return false;
      }
      if (!district) {
        toast.error('Vui lòng chọn quận/huyện.');
        return false;
      }
      if (!ward) {
        toast.error('Vui lòng chọn phường/xã.');
        return false;
      }
      if (!addressDetail.trim()) {
        toast.error('Vui lòng nhập địa chỉ chi tiết.');
        return false;
      }
    }
    return true;
  };

  // Áp dụng mã khuyến mãi
  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      toast.warn('Vui lòng nhập mã ưu đãi.');
      setDiscount(0);
      setTotal(subTotal);
      setPromoResult({ valid: false, message: '', discount: 0, promotion: null });
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
      const res = await orderApi.calculatePrice(priceData, user?.token);
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
      toast.error('Lỗi khi áp dụng mã ưu đãi.');
      setDiscount(0);
      setTotal(subTotal);
      setPromoResult({ valid: false, message: '', discount: 0, promotion: null });
    } finally {
      setPromoLoading(false);
    }
  };

  // Gửi đơn hàng
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (selectedItems.length === 0) {
      toast.error('Không có sản phẩm nào trong đơn hàng.');
      return;
    }

    setSubmitting(true);
    try {
      const orderData = {
        customer_id: user?.id,
        user_id: null,
        promotion_code: promoResult.valid ? promoCode.trim() : null,
        payment_method: paymentMethod,
        shipping_address: `${addressDetail}, ${findNameByCode(wards, ward)}, ${findNameByCode(districts, district)}, ${findNameByCode(provinces, province)}`,
        is_deposit: false,
        deposit_status: paymentMethod === 'cod' ? 'pending' : 'none',
        items: selectedItems.map((item) => ({
          product_id: item.product_id,
          quantity: item.count,
          price: item.price,
        })),
      };
      const res = await orderApi.checkout(orderData, user?.token);
      toast.success('Đặt hàng thành công! Mã đơn hàng: ' + res.order.order_id);
      dispatch({ type: 'CLEAR_CART' });
      navigate('/order-success', { state: { order: res.order } });
    } catch (error) {
      toast.error(
        'Lỗi khi đặt hàng: ' + (error.response?.data?.message || error.message || 'Vui lòng thử lại sau.'),
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Tạo QR động
  useEffect(() => {
    let amount = 0;
    if (paymentMethod === 'cod') {
      amount = Math.round(total * 0.1);
    } else if (paymentMethod === 'momo' || paymentMethod === 'ck') {
      amount = Math.round(total);
    }

    let qrStr = '';

    if (paymentMethod === 'cod') {
      const qrPay = QRPay.initVietQR({
        bankBin: BANK_CODE,
        bankNumber: BANK_ACCOUNT,
        amount: amount.toString(),
        purpose: 'Thanh toan đat coc',
      });
      qrStr = qrPay.build();
    } else if (paymentMethod === 'momo') {
      const momoQR = QRPay.initVietQR({
        bankBin: BanksObject.banviet.bin,
        bankNumber: MOMO_ACCOUNT,
        amount: amount.toString(),
        purpose: 'Thanh toan don hang qua MoMo',
      });
      momoQR.additionalData.reference = 'MOMOW2W' + MOMO_ACCOUNT.slice(-3);
      momoQR.setUnreservedField('80', '046');
      qrStr = momoQR.build();
    } else if (paymentMethod === 'ck') {
      const qrPay = QRPay.initVietQR({
        bankBin: BANK_CODE,
        bankNumber: BANK_ACCOUNT,
        amount: amount.toString(),
        purpose: 'Thanh toan',
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
          width: '100%',
          mx: 'auto',
          my: 5,
          p: 4,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 3,
          color: 'text.primary',
        }}
      >
        <ToastContainer position="top-right" autoClose={3000} />
        <Button
          onClick={() => navigate(-1)}
          startIcon={<ArrowBackIcon />}
          sx={{ mb: 3, color: '#003468', fontWeight: 'bold' }}
        >
          Quay lại
        </Button>
        <Typography variant="h5" fontWeight="bold" mb={4} color="#272727" align="center">
          Thông tin đặt hàng
        </Typography>

        {/* Sản phẩm đã chọn */}
        <Box mb={4} borderRadius={0} p={2} sx={{ border: 0, borderColor: 'none' }}>
          {selectedItems.length === 0 && <Typography color="text.secondary">Không có sản phẩm nào.</Typography>}
          {selectedItems.map((item) => (
            <Box
              key={item.product_id}
              display="flex"
              alignItems="center"
              borderBottom={1}
              borderColor="divider"
              pb={1}
              mb={1}
              sx={{ '&:last-child': { borderBottom: 'none', mb: 0, pb: 0 } }}
            >
              <img
                src={item.ProductImages?.[0]?.image_url || 'https://cdn.pnj.io/images/logo/pnj.com.vn.png'}
                alt={item.product_name}
                width={64}
                height={64}
                style={{ objectFit: 'cover', borderRadius: 4 }}
              />
              <Box ml={2}>
                <Typography fontWeight="bold" color="#003468">
                  {item.product_name}
                </Typography>
                <Typography variant="body2" mt={0.5} color="text.primary">
                  Số lượng: <strong>{item.count}</strong>
                </Typography>
                <div className="flex flex-row">
                  <Typography variant="body2" fontWeight="normal" color="primary.main" mt={0.5}>
                    Đơn giá:
                  </Typography>
                  <Typography variant="body2" fontWeight="bold" color="#C58C46" mt={0.5} ml={0.5}>
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                  </Typography>
                </div>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Mã ưu đãi */}
        <Box mb={2}>
          <TextField
            label="Nhập mã ưu đãi"
            fullWidth
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            disabled={promoLoading || (promoResult.valid && !!promoResult.promotion)}
            InputProps={{
              sx: {
                '& .MuiInputBase-input': {
                  py: 1.5,
                  textAlign: 'center',
                },
              },
              endAdornment: promoLoading ? (
                <CircularProgress size={20} />
              ) : (
                <Box ml={1} display="flex" alignItems="center" height="100%">
                  <Button
                    size="medium"
                    onClick={handleApplyPromo}
                    disabled={promoLoading || (promoResult.valid && !!promoResult.promotion)}
                    sx={{
                      color: '#fff',
                      fontWeight: 'bold',
                      px: 4,
                      minWidth: 110,
                      backgroundColor: '#b1b1b1',
                      borderRadius: 2,
                      whiteSpace: 'nowrap',
                      '&:hover': {
                        backgroundColor: '#979797',
                      },
                    }}
                  >
                    Áp dụng
                  </Button>
                </Box>
              ),
            }}
            helperText={promoResult.message}
            error={!promoResult.valid && promoResult.message !== ''}
          />

          {promoInfo && (
            <Box
              mt={2}
              p={2}
              borderRadius={2}
              sx={{
                bgcolor: '#e3f1fc',
                border: '1px solid #1976d2',
                color: '#003468',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                justifyContent: 'space-between',
              }}
            >
              <Box>
                <Typography fontWeight="bold" color="#1976d2">
                  Mã ưu đãi: {promoInfo.promotion_code}
                </Typography>
                {promoInfo.discount_percent && (
                  <Typography fontSize="1rem" color="#003468" mt={0.5}>
                    Giảm {promoInfo.discount_percent}% ({discount.toLocaleString('vi-VN')} đ)
                  </Typography>
                )}
                {promoInfo.description && (
                  <Typography color="#1976d2" fontSize="0.95rem">
                    {promoInfo.description}
                  </Typography>
                )}
              </Box>
              <Button
                onClick={() => {
                  setPromoCode('');
                  setDiscount(0);
                  setTotal(subTotal);
                  setPromoResult({ valid: false, message: '', discount: 0, promotion: null });
                  toast.info('Đã bỏ áp dụng mã khuyến mãi.');
                }}
                variant="text"
                color="primary"
                sx={{
                  minWidth: 40,
                  borderRadius: '50%',
                  p: 1,
                  ml: 2,
                  color: '#1976d2',
                  '&:hover': { bgcolor: '#e0e0e0' },
                }}
                title="Bỏ mã khuyến mãi"
              >
                <CloseIcon />
              </Button>
            </Box>
          )}
        </Box>

        {/* Tổng tiền */}
        <Box
          mb={2}
          p={2}
          borderRadius={1}
          sx={{ border: 0, borderColor: 'divider' }}
          color="text.primary"
          fontWeight="bold"
        >
          <Typography display="flex" justifyContent="space-between" mb={1}>
            <span>Tạm tính</span>
            <span>{subTotal.toLocaleString('vi-VN')} đ</span>
          </Typography>
          <Typography display="flex" justifyContent="space-between" mb={1}>
            <span>Giảm giá</span>
            <span style={{ color: '#d32f2f' }}>- {discount.toLocaleString('vi-VN')} đ</span>
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
            <span>{total.toLocaleString('vi-VN')} đ</span>
          </Typography>
          <Typography fontSize="0.75rem" fontStyle="italic" mt={1} color="text.secondary">
            (Giá tham khảo đã bao gồm VAT)
          </Typography>
        </Box>

        {/* Địa chỉ nhận hàng */}
        <Box mb={2}>
          <Typography variant="h6" sx={{ color: 'text.primary', mb: 2 }}>
            Địa chỉ nhận hàng
          </Typography>
          {deliveryMethod === 'delivery' && (
            <Box
              mt={3}
              display="grid"
              gridTemplateColumns="repeat(2, 1fr)"
              gap={2}
              sx={{
                maxWidth: 1200,
                width: '100%',
              }}
            >
              <FormControl fullWidth required>
                <Select
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  displayEmpty
                  sx={{ color: province ? 'inherit' : 'text.secondary' }}
                >
                  <MenuItem disabled value="">
                    Chọn tỉnh/thành *
                  </MenuItem>
                  {provinces.map((p) => (
                    <MenuItem key={p.code} value={p.code}>
                      {p.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth required>
                <Select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  displayEmpty
                  sx={{ color: district ? 'inherit' : 'text.secondary' }}
                  disabled={!districts.length}
                >
                  <MenuItem disabled value="">
                    Quận/huyện *
                  </MenuItem>
                  {districts.map((d) => (
                    <MenuItem key={d.code} value={d.code}>
                      {d.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth required>
                <Select
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  displayEmpty
                  sx={{ color: ward ? 'inherit' : 'text.secondary' }}
                  disabled={!wards.length}
                >
                  <MenuItem disabled value="">
                    Phường/xã *
                  </MenuItem>
                  {wards.map((w) => (
                    <MenuItem key={w.code} value={w.code}>
                      {w.name}
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
              variant={paymentMethod === 'cod' ? 'contained' : 'outlined'}
              onClick={() => setPaymentMethod('cod')}
              fullWidth
              sx={{
                justifyContent: 'flex-start',
                ...(paymentMethod === 'cod' && {
                  backgroundColor: '#003468',
                  color: '#fff',
                  '&:hover': { backgroundColor: '#002954' },
                }),
              }}
            >
              Thanh toán tiền mặt khi nhận hàng (COD)
            </Button>
            <Button
              variant={paymentMethod === 'momo' ? 'contained' : 'outlined'}
              onClick={() => setPaymentMethod('momo')}
              fullWidth
              sx={{
                justifyContent: 'flex-start',
                ...(paymentMethod === 'momo' && {
                  backgroundColor: '#003468',
                  color: '#fff',
                  '&:hover': { backgroundColor: '#002954' },
                }),
              }}
            >
              Thanh toán bằng MoMo
            </Button>
            <Button
              variant={paymentMethod === 'ck' ? 'contained' : 'outlined'}
              onClick={() => setPaymentMethod('ck')}
              fullWidth
              sx={{
                justifyContent: 'flex-start',
                ...(paymentMethod === 'ck' && {
                  backgroundColor: '#003468',
                  color: '#fff',
                  '&:hover': { backgroundColor: '#002954' },
                }),
              }}
            >
              Thanh toán bằng ngân hàng
            </Button>
          </Stack>

          {(paymentMethod === 'cod' || paymentMethod === 'momo' || paymentMethod === 'ck') && (
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
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <QRCodeSVG value={qrValue} size={180} />
              <Typography mt={1} fontWeight="medium" color="text.primary">
                Số tiền:{' '}
                <strong>
                  {paymentMethod === 'cod'
                    ? Math.round(total * 0.1).toLocaleString('vi-VN')
                    : Math.round(total).toLocaleString('vi-VN')}{' '}
                  đ
                </strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {paymentMethod === 'momo'
                  ? 'Ví MoMo'
                  : paymentMethod === 'ck'
                    ? BANK_NAME
                    : BANK_NAME}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={1}>
                {paymentMethod === 'momo'
                  ? MOMO_ACCOUNT
                  : paymentMethod === 'ck'
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
          sx={{
            justifyContent: 'flex-center',
            backgroundColor: '#003468',
            color: '#fff',
            '&:hover': { backgroundColor: '#002954' },
          }}
        >
          {submitting ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'ĐẶT HÀNG'}
        </Button>
      </Box>
    </MainLayout>
  );
};

export default CheckoutPage;