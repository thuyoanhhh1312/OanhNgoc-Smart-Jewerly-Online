module.exports = (err, req, res, next) => {
    console.error('Lỗi không xác định:', err.stack);
  
    // Kiểm tra nếu lỗi là do dữ liệu không hợp lệ
    if (err.message === 'Không tìm thấy dữ liệu') {
      return res.status(404).json({ message: err.message });
    }
  
    // Lỗi mặc định
    res.status(500).json({ message: 'Đã xảy ra lỗi, vui lòng thử lại sau!' });
  };