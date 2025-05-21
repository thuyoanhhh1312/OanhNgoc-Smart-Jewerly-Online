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
          [fn('COUNT', col('Orders.order_id')), 'orderCount'],
          [fn('COALESCE', fn('SUM', col('Orders.total')), 0), 'totalOrderAmount']
        ]
      },
      include: [
        {
          model: db.Order,
          attributes: [],
          required: false, // lấy cả khách hàng chưa có đơn hàng
        }
      ],
      group: ['Customer.customer_id'],
      order: [['customer_id', 'ASC']],
    });

    res.status(200).json(customers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi khi lấy danh sách khách hàng', error: err.message });
  }
};
