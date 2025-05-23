import db from '../models/index.js';
import { Op, fn, col, literal  } from 'sequelize';
// Lấy khách hàng theo ID
export const getCustomerById = async (req, res) => {
  const { id } = req.params;
  try {
    const customer = await db.Customer.findByPk(id);
    if (!customer) return res.status(404).json({ message: 'Khách hàng không tìm thấy' });
    res.status(200).json(customer);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy khách hàng', error: err.message });
  }
};

// Xóa khách hàng
export const deleteCustomer = async (req, res) => {
  const { id } = req.params;
  try {
    const customer = await db.Customer.findByPk(id);
    if (!customer) return res.status(404).json({ message: 'Khách hàng không tìm thấy' });

    await customer.destroy();
    res.status(200).json({ message: 'Khách hàng đã được xóa' });
  } catch (err) {
    res.status(400).json({ message: 'Lỗi khi xóa khách hàng', error: err.message });
  }
};

// Lấy danh sách khách hàng kèm số lượng đơn hàng và tổng tiền đơn hàng
export const getAllCustomers = async (req, res) => {
  const { keyword } = req.query;

  try {
    let whereClause = {};
    if (keyword && keyword.trim() !== '') {
      whereClause = {
        [Op.or]: [
          { name: { [Op.like]: `%${keyword}%` } },
          { email: { [Op.like]: `%${keyword}%` } },
          { phone: { [Op.like]: `%${keyword}%` } },
          { gender: { [Op.like]: `%${keyword}%` } },
          { address: { [Op.like]: `%${keyword}%` } },
        ],
      };
    }

    const customers = await db.Customer.findAll({
      where: whereClause,
      attributes: {
        include: [
          // Đếm số đơn hàng
          [fn('COUNT', col('Orders.order_id')), 'orderCount'],
          // Tổng tiền đơn hàng (COALESCE xử lý null)
          [fn('COALESCE', fn('SUM', col('Orders.total')), 0), 'totalOrderAmount'],

          // Đếm đánh giá tích cực (POS)
          [
            literal(`(
              SELECT COUNT(*) FROM product_review AS pr
              WHERE pr.customer_id = Customer.customer_id AND pr.sentiment = 'POS'
            )`),
            'positiveReviewCount'
          ],
          // Đếm đánh giá tiêu cực (NEG)
          [
            literal(`(
              SELECT COUNT(*) FROM product_review AS pr
              WHERE pr.customer_id = Customer.customer_id AND pr.sentiment = 'NEG'
            )`),
            'negativeReviewCount'
          ],
          // Đếm đánh giá trung tính (NEU)
          [
            literal(`(
              SELECT COUNT(*) FROM product_review AS pr
              WHERE pr.customer_id = Customer.customer_id AND pr.sentiment = 'NEU'
            )`),
            'neutralReviewCount'
          ],
        ],
      },
      include: [
        {
          model: db.Order,
          attributes: [],
          required: false, // lấy cả khách hàng chưa có đơn hàng
        },
      ],
      group: ['Customer.customer_id'],
      order: [['customer_id', 'ASC']],
      raw: true,  // để kết quả trả về object thuần, dễ dùng frontend
    });

    return res.status(200).json(customers);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: 'Lỗi khi lấy danh sách khách hàng',
      error: err.message,
    });
  }
};
