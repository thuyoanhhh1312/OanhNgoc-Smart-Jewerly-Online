import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../models/index.js';
import { ERROR_CODES } from '../utils/errorCodes.js';


const generateRandomPhone = () => {
  let phone = '0'; // Bắt đầu với số 0
  for (let i = 0; i < 9; i++) {
    phone += Math.floor(Math.random() * 10); // Tạo mỗi chữ số ngẫu nhiên từ 0 đến 9
  }
  return phone;
};

// Đăng ký người dùng (User + Customer)
export const registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  // Kiểm tra các trường bắt buộc
  if (!name || !email || !password) {
    return next({
      statusCode: 400,
      code: ERROR_CODES.VALIDATION_ERROR,
      message: 'Vui lòng nhập đầy đủ họ tên, email và mật khẩu.'
    });
  }

  const t = await db.sequelize.transaction(); // Dùng transaction để đảm bảo toàn vẹn

  try {
    // Kiểm tra email đã tồn tại ở bảng User
    const existingUser = await db.User.findOne({ where: { email } });

    if (existingUser) {
      return next({
        statusCode: 409,
        code: ERROR_CODES.EMAIL_ALREADY_EXISTS,
        message: 'Email đã tồn tại.'
      });
    }

    // Mã hóa mật khẩu
    const salt = await bcrypt.genSalt(12);  // Sử dụng 12 vòng lặp thay vì 10
    const hashedPassword = await bcrypt.hash(password, salt);

    // Tạo user
    const newUser = await db.User.create(
      { name, email, password: hashedPassword, role_id: 2 }, // role_id=2 là customer
      { transaction: t }
    );

    // Tạo số điện thoại ngẫu nhiên
    const randomPhone = generateRandomPhone();

    // Tạo customer liên kết user_id
    const newCustomer = await db.Customer.create(
      {
        user_id: newUser.id,
        name,
        email,
        phone: randomPhone,  // Sử dụng số điện thoại ngẫu nhiên
        gender: null,
        address: null
      },
      { transaction: t }
    );

    // Tạo token xác thực người dùng
    const accessToken = jwt.sign(
      { userId: newUser.id, email: newUser.email, role_id: newUser.role_id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '24h' }
    );

    const refreshToken = jwt.sign(
      { userId: newUser.id },
      process.env.JWT_REFRESH_SECRET_KEY,
      { expiresIn: '7d' }
    );

    newUser.refresh_token = refreshToken;
    await newUser.save({ transaction: t });

    // Commit transaction sau khi thành công
    await t.commit();

    return res.status(201).json({
      message: 'Đăng ký thành công',
      accessToken,
      refreshToken,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role_id: newUser.role_id
      },
      customer: {
        customer_id: newCustomer.customer_id,
        name: newCustomer.name,
        email: newCustomer.email,
        phone: newCustomer.phone,
        gender: newCustomer.gender,
        address: newCustomer.address
      }
    });
  } catch (err) {
    await t.rollback();
    return next({
      statusCode: 500,
      code: ERROR_CODES.INTERNAL_SERVER_ERROR,
      message: 'Lỗi server. Vui lòng thử lại sau.',
      error: err.message
    });
  }
};


// Đăng nhập người dùng
export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next({
      statusCode: 400,
      code: ERROR_CODES.VALIDATION_ERROR,
      message: 'Vui lòng nhập email và mật khẩu.'
    });
  }

  try {
    const user = await db.User.findOne({ where: { email } });
    const isValid = user && await bcrypt.compare(password, user.password);

    if (!isValid) {
      return next({
        statusCode: 401,
        code: ERROR_CODES.INVALID_CREDENTIALS,
        message: 'Email hoặc mật khẩu không đúng.'
      });
    }

    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, role_id: user.role_id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '24h' }
    );

    const refreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET_KEY,
      { expiresIn: '7d' }
    );

    user.refresh_token = refreshToken;
    await user.save();

    return res.status(200).json({
      message: 'Đăng nhập thành công',
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role_id: user.role_id
      }
    });
  } catch (err) {
    return next({
      statusCode: 500,
      code: ERROR_CODES.INTERNAL_SERVER_ERROR,
      message: 'Lỗi server. Vui lòng thử lại sau.',
      error: err.message
    });
  }
};

export const refreshToken = async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return next({
      statusCode: 401,
      code: ERROR_CODES.TOKEN_INVALID,
      message: 'Thiếu refresh token.'
    });
  }

  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY);
    const user = await db.User.findOne({ where: { id: payload.userId } });

    if (!user || user.refresh_token !== refreshToken) {
      return next({
        statusCode: 403,
        code: ERROR_CODES.UNAUTHORIZED,
        message: 'Refresh token không hợp lệ.'
      });
    }

    const newAccessToken = jwt.sign(
      { userId: user.id, email: user.email, role_id: user.role_id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '24h' }
    );

    const newRefreshToken = jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET_KEY,
      { expiresIn: '7d' }
    );

    user.refresh_token = newRefreshToken;
    await user.save();

    return res.status(200).json({
      message: 'Làm mới token thành công',
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    });
  } catch (err) {
    return next({
      statusCode: 403,
      code: ERROR_CODES.TOKEN_INVALID,
      message: 'Refresh token không hợp lệ hoặc đã hết hạn.'
    });
  }
};

export const logoutUser = async (req, res, next) => {
  const { userId } = req.user;

  try {
    const user = await db.User.findByPk(userId);
    if (user) {
      user.refresh_token = null;
      await user.save();
    }

    return res.status(200).json({ message: 'Đăng xuất thành công.' });
  } catch (err) {
    return next({
      statusCode: 500,
      code: ERROR_CODES.INTERNAL_SERVER_ERROR,
      message: 'Lỗi khi đăng xuất.',
      error: err.message
    });
  }
};

export const currentUser = async (req, res, next) => {
  const { user } = req;

  try {
    if (!user) {
      return next({
        statusCode: 404,
        code: ERROR_CODES.USER_NOT_FOUND,
        message: 'Người dùng không tồn tại.'
      });
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    return next({
      statusCode: 500,
      code: ERROR_CODES.INTERNAL_SERVER_ERROR,
      message: 'Không thể lấy thông tin người dùng.',
      error: err.message
    });
  }
};

export const currentAdmin = async (req, res, next) => {
  try {
    const { user } = req;
    if (user.role_id !== 1) {
      return res.status(403).json({
        code: ERROR_CODES.UNAUTHORIZED,
        message: "Bạn không có quyền truy cập (Admin only)",
      });
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    next({
      statusCode: 500,
      code: ERROR_CODES.INTERNAL_SERVER_ERROR,
      message: "Không xác định được quyền truy cập.",
    });
  }
};

export const currentStaffOrAdmin = async (req, res, next) => {
  try {
    const { user } = req;
    if (user.role_id !== 1 && user.role_id !== 3) {
      return res.status(403).json({
        code: ERROR_CODES.UNAUTHORIZED,
        message: "Bạn không có quyền truy cập (Admin or Staff)",
      });
    }

    res.status(200).json({ ok: true });
  } catch (err) {
    next({
      statusCode: 500,
      code: ERROR_CODES.INTERNAL_SERVER_ERROR,
      message: "Không xác định được quyền truy cập.",
    });
  }
};

export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next({
      statusCode: 400,
      code: ERROR_CODES.VALIDATION_ERROR,
      message: 'Vui lòng nhập email.'
    });
  }

  try {
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      // Email không tồn tại trong DB
      return res.status(404).json({
        message: 'Email không tồn tại trong hệ thống.'
      });
    }

    // Tạo token reset password chứa email, hạn 15 phút
    const resetToken = jwt.sign(
      { email: user.email },
      process.env.JWT_RESET_PASSWORD_SECRET_KEY,
      { expiresIn: '15m' }
    );

    // Trả token reset về frontend (frontend lưu token này để dùng cho bước reset-password)
    return res.status(200).json({
      message: 'Email hợp lệ. Vui lòng tiếp tục đổi mật khẩu.',
      resetToken
    });
  } catch (err) {
    return next({
      statusCode: 500,
      code: ERROR_CODES.INTERNAL_SERVER_ERROR,
      message: 'Lỗi server. Vui lòng thử lại sau.',
      error: err.message
    });
  }
};

export const resetPassword = async (req, res, next) => {
  const { password, confirm_password, resetToken } = req.body;

  if (!password || !confirm_password || !resetToken) {
    return next({
      statusCode: 400,
      code: ERROR_CODES.VALIDATION_ERROR,
      message: 'Vui lòng nhập đầy đủ mật khẩu, xác nhận mật khẩu.'
    });
  }

  if (password !== confirm_password) {
    return next({
      statusCode: 400,
      code: ERROR_CODES.VALIDATION_ERROR,
      message: 'Mật khẩu và xác nhận mật khẩu không khớp.'
    });
  }

  try {
    // Giải mã token lấy email
    const decoded = jwt.verify(resetToken, process.env.JWT_RESET_PASSWORD_SECRET_KEY);
    const email = decoded.email;

    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        message: 'Người dùng không tồn tại.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({
      message: 'Đổi mật khẩu thành công.'
    });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next({
        statusCode: 401,
        code: ERROR_CODES.TOKEN_EXPIRED,
        message: 'Token đổi mật khẩu đã hết hạn. Vui lòng thử lại.'
      });
    }
    if (err.name === 'JsonWebTokenError') {
      return next({
        statusCode: 401,
        code: ERROR_CODES.TOKEN_INVALID,
        message: 'Token đổi mật khẩu không hợp lệ.'
      });
    }
    return next({
      statusCode: 500,
      code: ERROR_CODES.INTERNAL_SERVER_ERROR,
      message: 'Lỗi server. Vui lòng thử lại sau.',
      error: err.message
    });
  }
};