const express = require("express");
const app = express();
const apiRoutes = require("./routes/apiRoutes"); // Import apiRoutes
const cors = require('cors');
// Middleware để xử lý dữ liệu JSON
app.use(express.json());
const corsOptions = {
  origin: 'http://localhost:3000', // Chỉ cho phép domain này truy cập
  methods: 'GET,POST,PUT,DELETE',  // Các phương thức cho phép
  allowedHeaders: 'Content-Type,Authorization,authtoken', // Các header cho phép
};

app.use(cors(corsOptions));
// Sử dụng route cho các request tới /api
app.use("/api", apiRoutes);  // Sử dụng "/api" làm tiền tố cho tất cả các API
// Sử dụng middleware cors để cho phép các yêu cầu từ các nguồn khác nhau
// Lắng nghe cổng
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server đang chạy trên http://localhost:${port}`);
});

module.exports = app;
