import db from "../models/index.js";

export const getAllOrders = async (req, res) => {
  try {
    const orders = await db.Order.findAll({
      include: [
        {
          model: db.Customer,
          attributes: ["name", "email", "phone"],
        },
        {
          model: db.User,
          attributes: ["name"],
        },
        {
          model: db.Promotion,
          attributes: ["promotion_code"],
        },
        {
          model: db.OrderStatus,
          attributes: ["status_name", "color_code"],
        },
        {
          model: db.OrderItem,
          attributes: ["quantity", "price"],
          include: [
            {
              model: db.Product,
              attributes: ["product_name"],
            },
          ],
        },
      ],
    });
    res.status(200).json(orders);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách đơn hàng:", error);
    res.status(500).json({
      message: "Lỗi khi lấy danh sách đơn hàng",
      error: error.message,
    });
  }
};

export const getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await db.Order.findByPk(id, {
      include: [
        {
          model: db.Customer,
          attributes: ["name", "email", "phone"],
        },
        {
          model: db.OrderStatus,
          attributes: ["status_name", "color_code"],
        },
        {
          model: db.OrderItem,
          attributes: ["quantity", "price"],
          include: [
            {
              model: db.Product,
              attributes: ["product_name"],
            },
          ],
        },
        {
          model: db.Promotion,
          attributes: ["promotion_code"],
        },
      ],
    });
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error("Lỗi khi lấy đơn hàng:", error);
    res.status(500).json({
      message: "Lỗi khi lấy đơn hàng",
      error: error.message,
    });
  }
};

export const updatedOrder = async (req, res) => {
  const { id } = req.params;
  const { status_id } = req.body;
  try {
    const order = await db.Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
    if (status_id === 4 || status_id === 5) {
      return res.status(404).json({
        message: "Không được phép chỉnh sửa đơn hàng đã giao hoặc đã hủy",
      });
    }
    order.status_id = status_id;
    await order.save();
    res.status(200).json({ message: "Cập nhật đơn hàng thành công" });
  } catch (error) {
    console.error("Lỗi khi cập nhật đơn hàng:", error);
    res.status(500).json({
      message: "Lỗi khi cập nhật đơn hàng",
      error: error.message,
    });
  }
};

export const updatedStaff = async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;
  try {
    const order = await db.Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
    order.user_id = user_id;
    await order.save();
    res.status(200).json({ message: "Cập nhật đơn hàng thành công" });
  } catch (error) {
    console.error("Lỗi khi cập nhật đơn hàng:", error);
    res.status(500).json({
      message: "Lỗi khi cập nhật đơn hàng",
      error: error.message,
    });
  }
};

export const getOrderByUserId = async (req, res) => {
  const { user_id } = req.params;
  try {
    const orders = await db.Order.findAll({
      where: { user_id: user_id },
      include: [
        {
          model: db.Customer,
          attributes: ["name", "email", "phone"],
        },
        {
          model: db.OrderStatus,
          attributes: ["status_name", "color_code"],
        },
        {
          model: db.OrderItem,
          attributes: ["quantity", "price"],
          include: [
            {
              model: db.Product,
              attributes: ["product_name"],
            },
          ],
        },
      ],
    });
    if (!orders) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }
    res.status(200).json(orders);
  } catch (error) {
    console.error("Lỗi khi lấy đơn hàng:", error);
    res.status(500).json({
      message: "Lỗi khi lấy đơn hàng",
      error: error.message,
    });
  }
};
export const createOrder = async (req, res) => {
  const { customer_id, user_id, promotion_id, sub_total, discount, total, shipping_address, payment_method } = req.body;

  try {
    const deposit = (total * 0.1).toFixed(2); // 10% đặt cọc
    const order = await db.Order.create({
      customer_id,
      user_id,
      promotion_id,
      sub_total,
      discount,
      total,
      deposit,
      deposit_status: 'pending',
      shipping_address,
      payment_method,
      status_id: 1, // trạng thái mới tạo
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: "Lỗi tạo đơn hàng", error: err.message });
  }
};

export const confirmDepositPayment = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await db.Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }

    order.deposit_status = "paid";
    order.status_id = 2; // ví dụ trạng thái: đã thanh toán đặt cọc
    await order.save();

    res.status(200).json({ message: "Xác nhận thanh toán đặt cọc thành công", order });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xác nhận thanh toán", error: error.message });
  }
};