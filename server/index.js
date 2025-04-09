const express = require("express");
const app = express();
const apiRoutes = require("./routes/apiRoutes"); // Import apiRoutes

// Middleware để xử lý dữ liệu JSON
app.use(express.json());

// Sử dụng route cho các request tới /api
app.use("/api", apiRoutes);  // Sử dụng "/api" làm tiền tố cho tất cả các API

// Lắng nghe cổng
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server đang chạy trên http://localhost:${port}`);
});

module.exports = app;
