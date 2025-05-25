import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    Box,
    Typography,
    Button,
    Paper,
    Divider,
    Stack,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import MainLayout from "../layout/MainLayout";

const OrderSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();
    // Lấy dữ liệu đơn hàng từ location.state
    const order = location.state?.order;

    console.log("order", order)

    // Format tiền Việt
    const formatCurrency = (amount) =>
        new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount);

    return (
        <MainLayout>
            <Box
                sx={{
                    maxWidth: 700,
                    margin: "40px auto",
                    padding: 4,
                    bgcolor: "background.paper",
                    borderRadius: 3,
                    boxShadow: 3,
                    textAlign: "center",
                    color: "#003468",
                }}
            >
                <CheckCircleOutlineIcon
                    sx={{ fontSize: 80, color: "#4caf50", mb: 2 }}
                />
                <Typography variant="h4" fontWeight="bold" mb={1}>
                    Đặt hàng thành công!
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" mb={3}>
                    Cảm ơn bạn đã tin tưởng và đặt mua sản phẩm tại PNJ.
                    Đơn hàng của bạn đang được xử lý.
                </Typography>

                {order ? (
                    <Paper
                        elevation={1}
                        sx={{
                            textAlign: "left",
                            p: 3,
                            mb: 4,
                            bgcolor: "#e3f2fd",
                            borderRadius: 2,
                        }}
                    >
                        <Typography variant="h6" fontWeight="bold" mb={2}>
                            Thông tin đơn hàng
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Typography>
                            <strong>Mã đơn hàng:</strong> {order.order_id}
                        </Typography>
                        <Typography>
                            <strong>Khách hàng:</strong> {order.Customer?.name || "N/A"}
                        </Typography>
                        <Typography>
                            <strong>Email:</strong> {order.Customer?.email || "N/A"}
                        </Typography>
                        <Typography>
                            <strong>Số điện thoại:</strong> {order.Customer?.phone || "N/A"}
                        </Typography>
                        <Typography>
                            <strong>Địa chỉ giao hàng:</strong> {order.shipping_address}
                        </Typography>
                        <Typography>
                            <strong>Phương thức thanh toán:</strong>{" "}
                            {order.payment_method === "cod"
                                ? "Thanh toán khi nhận hàng (COD)"
                                : order.payment_method === "momo"
                                    ? "Ví MoMo"
                                    : "Chuyển khoản ngân hàng"}
                        </Typography>
                        <Typography>
                            <strong>Tạm tính:</strong> {formatCurrency(order.sub_total)}
                        </Typography>
                        <Typography>
                            <strong>Giảm giá:</strong>{" "}
                            <span style={{ color: "#d32f2f" }}>
                                - {formatCurrency(order.discount)}
                            </span>
                        </Typography>
                        <Typography fontWeight="bold" fontSize="1.2rem" mt={1}>
                            Tổng cộng: {formatCurrency(order.total)}
                        </Typography>
                    </Paper>
                ) : (
                    <Typography color="text.secondary" mb={3}>
                        Không có thông tin đơn hàng hiển thị.
                    </Typography>
                )}

                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={() => navigate("/")}
                    sx={{
                        justifyContent: "flex-center",
                        ...({
                            backgroundColor: "#003468",
                            color: "#fff",
                            '&:hover': { backgroundColor: "#002954" },
                        }),
                    }}
                >
                    Tiếp tục mua sắm
                </Button>
            </Box>
        </MainLayout>
    );
};

export default OrderSuccess;