const db = require('../config/db'); 

// Hàm lấy danh sách tất cả các role
exports.getAllRoles = (req, res) => {
    db.query('SELECT * FROM role', (err, results) => {
      if (err) {
        console.error('Lỗi khi truy vấn cơ sở dữ liệu:', err);
        return res.status(500).json({ message: 'Lỗi truy vấn cơ sở dữ liệu' });
      }
  
      if (!results || results.length === 0) {
        return res.status(404).json({ message: 'Không tìm thấy dữ liệu' });
      }
  
      res.json(results);
    });
};
