// server.js hoặc index.js
import express from 'express';
import cors from 'cors';
import apiRoutes from './routes/apiRoutes.js'; // Đảm bảo file này cũng dùng export default nếu là ES Module
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

app.use(express.json());

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization,authtoken',
};

app.use(cors(corsOptions));

app.use("/api", apiRoutes);

// middleware xử lý lỗi toàn cục
app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server đang chạy trên http://localhost:${port}`);
});

export default app;
