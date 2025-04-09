// controllers/roleController.js
const Role = require('../models/role');  // Import mô hình role

// Hàm lấy tất cả các role từ cơ sở dữ liệu
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();  // Lấy tất cả các role
    res.json(roles);
  } catch (err) {
    console.error('Lỗi khi truy vấn cơ sở dữ liệu:', err);
    res.status(500).json({ message: 'Lỗi truy vấn cơ sở dữ liệu' });
  }
};

// Hàm tạo mới một role
exports.createRole = async (req, res) => {
  const { name, description } = req.body;
  try {
    const role = await Role.create({ name, description });  // Tạo role mới
    res.status(201).json(role);  // Trả về role vừa tạo
  } catch (err) {
    console.error('Lỗi khi tạo role:', err);
    res.status(500).json({ message: 'Lỗi khi tạo role' });
  }
};
