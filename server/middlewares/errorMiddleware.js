// module.exports = (err, req, res, next) => {
//     console.error('Lỗi không xác định:', err.stack);
  
//     // Kiểm tra nếu lỗi là do dữ liệu không hợp lệ
//     if (err.message === 'Không tìm thấy dữ liệu') {
//       return res.status(404).json({ message: err.message });
//     }
  
//     // Lỗi mặc định
//     res.status(500).json({ message: 'Đã xảy ra lỗi, vui lòng thử lại sau!' });
//   };
module.exports = (err, req, res, next) => {
  console.error('Lỗi không xác định:', err.stack);

  // Nếu lỗi có trường statusCode (vd lỗi do xác thực token), lấy ra, ngược lại mặc định 500
  const statusCode = err.statusCode || 500;

  // Lấy message lỗi, nếu không có thì mặc định
  const message = err.message || 'Đã xảy ra lỗi, vui lòng thử lại sau!';

  // Nếu lỗi message chính xác là 'Không tìm thấy dữ liệu', trả 404
  if (message === 'Không tìm thấy dữ liệu') {
    return res.status(404).json({ message });
  }

  // Nếu lỗi có code thì gửi cùng
  if (err.code) {
    return res.status(statusCode).json({ code: err.code, message });
  }

  // Trả về lỗi mặc định với statusCode và message
  return res.status(statusCode).json({ message });
};
