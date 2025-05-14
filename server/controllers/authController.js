// controllers/authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { ERROR_CODES } from '../utils/errorCodes.js';

// Đăng ký người dùng
export const registerUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next({
      statusCode: 400,
      code: ERROR_CODES.VALIDATION_ERROR,
      message: 'Vui lòng nhập đầy đủ họ tên, email và mật khẩu.'
    });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return next({
        statusCode: 409,
        code: ERROR_CODES.EMAIL_ALREADY_EXISTS,
        message: 'Email đã tồn tại.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({ name, email, password: hashedPassword });

    //token xác thực người dùng
    const accessToken = jwt.sign(
      { userId: newUser.id, email: newUser.email, role_id: newUser.role_id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1h' }
    );

    //token dùng refresh
    const refreshToken = jwt.sign(
      { userId: newUser.id },
      process.env.JWT_REFRESH_SECRET_KEY,
      { expiresIn: '7d' }
    );

    newUser.refresh_token = refreshToken;
    await newUser.save();

    return res.status(201).json({
      message: 'Đăng ký thành công',
      accessToken,
      refreshToken,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role_id: newUser.role_id
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
    const user = await User.findOne({ where: { email } });
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
      { expiresIn: '1h' }
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
    const user = await User.findOne({ where: { id: payload.userId } });

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
      { expiresIn: '15m' }
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
    const user = await User.findByPk(userId);
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

export const getCurrentUser = async (req, res, next) => {
  const { userId } = req.user;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return next({
        statusCode: 404,
        code: ERROR_CODES.USER_NOT_FOUND,
        message: 'Người dùng không tồn tại.'
      });
    }

    return res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email
    });
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
