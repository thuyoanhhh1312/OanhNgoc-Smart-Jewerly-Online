import db from '../models/index.js';
import { Op } from 'sequelize';
// // Lấy danh sách khách hàng
// export const getAllCustomers = async (req, res) => {
//   try {
//     const customers = await db.Customer.findAll();
//     res.status(200).json(customers);
//   } catch (err) {
//     res.status(500).json({ message: 'Lỗi khi lấy danh sách khách hàng', error: err.message });
//   }
// };

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

// // Tạo khách hàng mới
// export const createCustomer = async (req, res) => {
//   try {
//     const newCustomer = await db.Customer.create(req.body);
//     res.status(201).json(newCustomer);
//   } catch (err) {
//     res.status(400).json({ message: 'Lỗi khi tạo khách hàng', error: err.message });
//   }
// };
export const createCustomer = async (req, res) => {
  try {
    console.log('Payload user:', req.user); // kiểm tra payload user trong token
    const userId = req.user.id;  // lấy user_id từ payload token

    const newCustomer = await db.Customer.create({
      ...req.body,
      user_id: userId, // gán user_id từ token cho customer
    });

    res.status(201).json(newCustomer);
  } catch (err) {
    res.status(400).json({ message: "Lỗi khi tạo khách hàng", error: err.message });
  }
};



// Cập nhật khách hàng
export const updateCustomer = async (req, res) => {
  const { id } = req.params;
  try {
    const customer = await db.Customer.findByPk(id);
    if (!customer) return res.status(404).json({ message: 'Khách hàng không tìm thấy' });

    // Cập nhật trường
    const { name, email, phone, gender, address } = req.body;
    customer.name = name ?? customer.name;
    customer.email = email ?? customer.email;
    customer.phone = phone ?? customer.phone;
    customer.gender = gender ?? customer.gender;
    customer.address = address ?? customer.address;

    await customer.save();
    res.status(200).json(customer);
  } catch (err) {
    res.status(400).json({ message: 'Lỗi khi cập nhật khách hàng', error: err.message });
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

export const getAllCustomers = async (req, res) => {
  const { keyword } = req.query;  // lấy keyword từ query param

  try {
    let whereClause = {};
    if (keyword) {
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

    const customers = await db.Customer.findAll({ where: whereClause });
    res.status(200).json(customers);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách khách hàng', error: err.message });
  }
};