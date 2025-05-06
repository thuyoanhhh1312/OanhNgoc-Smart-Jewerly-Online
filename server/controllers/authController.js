// controllers/authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js'; // nhớ thêm đuôi .js khi dùng ES Module

// Đăng ký người dùng
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email đã tồn tại' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({ name, email, password: hashedPassword });

    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({
      message: 'Đăng ký thành công',
      token,
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// Đăng nhập người dùng
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Email không tồn tại' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mật khẩu không đúng' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: 'Đăng nhập thành công',
      token,
    });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

// Tạo hoặc cập nhật người dùng
export const createOrUpdateUser = async (req, res) => {
  const { name, email } = req.user;
  console.log("req.user", req.user);

  try {
    const user = await User.findOne({ where: { email } });

    if (user) {
      user.name = name || email.split('@')[0];
      await user.save();
      console.log("USER UPDATED", user);
      res.json(user);
    } else {
      const newUser = await User.create({
        email,
        name: name || email.split('@')[0],
        role_id: 2,
      });
      console.log("USER CREATED", newUser);
      res.json(newUser);
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Error creating or updating user", error: error.message });
  }
};

// Lấy người dùng hiện tại
export const currentUser = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { email: req.user.email },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching current user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
