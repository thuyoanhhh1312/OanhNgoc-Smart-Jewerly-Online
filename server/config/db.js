const mysql = require('mysql2');
require('dotenv').config();  // Để đọc các biến môi trường từ .env

// Cấu hình kết nối MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,       // Lấy từ .env
  user: process.env.DB_USER,       // Lấy từ .env
  password: process.env.DB_PASSWORD, // Lấy từ .env
  database: process.env.DB_NAME     // Lấy từ .env
});

// Kiểm tra kết nối khi ứng dụng khởi động
db.connect((err) => {
    if (err) {
      console.error('Lỗi kết nối cơ sở dữ liệu:', err.stack);
      process.exit(1);  // Nếu lỗi, thoát ứng dụng ngay lập tức
    }
    console.log('Kết nối đến cơ sở dữ liệu MySQL thành công!');
});

// Xử lý kết nối thất bại và tái kết nối
db.on('error', (err) => {
    console.error('Lỗi cơ sở dữ liệu:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.log('Đang cố gắng kết nối lại...');
      // Cố gắng kết nối lại khi mất kết nối
      connectToDatabase();
    } else {
      console.error('Lỗi không thể xử lý:', err);
    }
});

// Hàm kết nối lại khi mất kết nối
function connectToDatabase() {
    db.connect((err) => {
      if (err) {
        console.error('Không thể kết nối lại cơ sở dữ liệu:', err.stack);
        setTimeout(connectToDatabase, 2000);  // Thử lại sau 2 giây
      } else {
        console.log('Kết nối lại thành công!');
      }
    });
}

module.exports = db;  // Xuất đối tượng db để sử dụng trong các file khác
