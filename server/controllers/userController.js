const User = require('../models/user');

// Lấy tất cả người dùng
const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy các người dùng', error: err.message });
  }
};

// Lấy người dùng theo ID
const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tìm thấy' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy người dùng', error: err.message });
  }
};

// Cập nhật thông tin người dùng
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, role_id } = req.body;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tìm thấy' });
    }
    user.name = name || user.name;
    user.email = email || user.email;
    user.role_id = role_id || user.role_id;

    await user.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi cập nhật người dùng', error: err.message });
  }
};

// Xóa người dùng
const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'Người dùng không tìm thấy' });
    }
    await user.destroy();
    res.status(200).json({ message: 'Người dùng đã được xóa' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi xóa người dùng', error: err.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
