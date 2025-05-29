import React, { useEffect, useState } from "react";
import MainLayout from "../layout/MainLayout";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Stack,
  Chip,
  Collapse,
  IconButton,
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { useSelector } from "react-redux";
import orderApi from "../api/orderApi";
import { format } from "date-fns";

const UserOrderHistory = () => {
  const { user } = useSelector((state) => ({ ...state }));
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrderIds, setExpandedOrderIds] = useState(new Set());

  useEffect(() => {
    async function fetchOrders() {
      if (!user?.id) {
        setError("Bạn chưa đăng nhập.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await orderApi.getOrderByCustomer(user.id, user.token);
        setOrders(data);
      } catch (err) {
        setError("Lỗi khi tải đơn hàng. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [user]);

  const toggleExpand = (orderId) => {
    setExpandedOrderIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) newSet.delete(orderId);
      else newSet.add(orderId);
      return newSet;
    });
  };

  return (
    <MainLayout>
      <Box
        sx={{
          maxWidth: 1500,
          margin: "20px auto",
          p: 3,
          bgcolor: "white",
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography
          variant="h4"
          mb={3}
          sx={{ color: "#003468", fontWeight: "bold", textAlign: "center" }}
        >
          Lịch sử đơn hàng
        </Typography>

        {loading && (
          <Stack alignItems="center" mt={4}>
            <CircularProgress color="primary" />
          </Stack>
        )}

        {error && (
          <Typography color="error" align="center" mt={2}>
            {error}
          </Typography>
        )}

        {!loading && !error && orders.length === 0 && (
          <Typography align="center" color="text.secondary">
            Bạn chưa có đơn hàng nào.
          </Typography>
        )}

        {!loading && !error && orders.length > 0 && (
          <List>
            {orders.map((order) => {
              const isExpanded = expandedOrderIds.has(order.order_id);
              return (
                <Paper
                  key={order.order_id}
                  elevation={2}
                  sx={{ mb: 2, p: 2, bgcolor: "#e8f0fe", borderRadius: 2 }}
                >
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ cursor: "pointer" }}
                    onClick={() => toggleExpand(order.order_id)}
                  >
                    <Typography
                      variant="h6"
                      sx={{ color: "#003468", fontWeight: "bold" }}
                    >
                      Đơn hàng #{order.order_id}
                    </Typography>
                    <Chip
                      label={order.OrderStatus?.status_name || "Chưa cập nhật"}
                      sx={{
                        backgroundColor: order.OrderStatus?.color_code || "#1976d2",
                        color: "#fff",
                        fontWeight: "bold",
                      }}
                    />
                    <IconButton size="small" onClick={() => toggleExpand(order.order_id)}>
                      {isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </Stack>
                  <Typography variant="body2" color="text.secondary" mt={0.5}>
                    Ngày tạo:{" "}
                    {order.created_at
                      ? format(new Date(order.created_at), "dd/MM/yyyy HH:mm")
                      : "Không rõ"}
                  </Typography>

                  <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    <Box mt={2}>
                      <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                        Thông tin khách hàng
                      </Typography>
                      <Typography>Tên: {order.Customer?.name || "Không có"}</Typography>
                      <Typography>Email: {order.Customer?.email || "Không có"}</Typography>
                      <Typography>Điện thoại: {order.Customer?.phone || "Không có"}</Typography>

                      <Divider sx={{ my: 2 }} />

                      <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                        Địa chỉ giao hàng
                      </Typography>
                      <Typography>
                        {order.shipping_address || "Chưa cập nhật"}
                      </Typography>

                      <Divider sx={{ my: 2 }} />

                      <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                        Phương thức thanh toán
                      </Typography>
                      <Typography>
                        {order.payment_method
                          ? order.payment_method.toUpperCase()
                          : "Chưa cập nhật"}
                      </Typography>

                      <Divider sx={{ my: 2 }} />

                      <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                        Danh sách sản phẩm
                      </Typography>
                      {order.OrderItems?.length > 0 ? (
                        <List disablePadding>
                          {order.OrderItems.map((item) => (
                            <ListItem key={item.order_item_id} sx={{ pl: 0 }}>
                              <ListItemText
                                primary={item.Product?.product_name || "Sản phẩm"}
                                secondary={`Số lượng: ${item.quantity} | Giá: ${Number(
                                  item.price,
                                ).toLocaleString("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                })}`}
                              />
                            </ListItem>
                          ))}
                        </List>
                      ) : (
                        <Typography>Không có sản phẩm</Typography>
                      )}

                      <Divider sx={{ my: 2 }} />

                      <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                        Tổng tiền
                      </Typography>
                      <Typography>
                        Tạm tính:{" "}
                        {Number(order.sub_total).toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </Typography>
                      <Typography>
                        Giảm giá:{" "}
                        {Number(order.discount).toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </Typography>
                      <Typography fontWeight="bold" fontSize="1.2rem">
                        Tổng cộng:{" "}
                        {Number(order.total).toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </Typography>
                    </Box>
                  </Collapse>
                </Paper>
              );
            })}
          </List>
        )}
      </Box>
    </MainLayout>
  );
};

export default UserOrderHistory;