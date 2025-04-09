require('dotenv').config();  // Đọc biến môi trường từ file .env
const express = require('express');
const mysql = require('mysql2');  // Cài mysql2
// const roleRoutes = require('./routes/roleRoutes'); // Import route role
const apiRoutes = require('./routes/apiRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');  // Import middleware xử lý lỗi

const app = express();
const port = process.env.PORT || 3000;

// Cấu hình kết nối MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Kết nối đến cơ sở dữ liệu
db.connect((err) => {
  if (err) {
    console.error('Lỗi kết nối cơ sở dữ liệu:', err.stack);
    return;
  }
  console.log('Kết nối đến cơ sở dữ liệu MySQL thành công!');
});

app.use(express.json());

// Sử dụng route
// app.use('/role', roleRoutes);
app.use('/api', apiRoutes());

// Middleware xử lý lỗi
app.use(errorMiddleware);  // Đặt middleware xử lý lỗi ở cuối chuỗi middleware

// Lắng nghe cổng
app.listen(port, () => {
  console.log(`Server đang chạy trên http://localhost:${port}`);
});
