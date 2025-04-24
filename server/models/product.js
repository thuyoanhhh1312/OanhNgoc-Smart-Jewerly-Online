const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');  // Kết nối với cơ sở dữ liệu
const Category = require('./category'); // Import model Category
const Subcategory = require('./subcategory'); // Import model Subcategory

const Product = sequelize.define('Product', {
    product_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,  // Tự động tăng
    },
    product_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,  // Tên sản phẩm phải là duy nhất
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,  // Mô tả là tùy chọn
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,  // Giá sản phẩm bắt buộc
    },
    quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0,  // Mặc định số lượng là 0
    },
    // image_url: {
    //     type: DataTypes.STRING,
    //     allowNull: true,  // Đường dẫn hình ảnh là tùy chọn
    // },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,  // Thời gian tạo mặc định là thời gian hiện tại
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,  // Thời gian cập nhật mặc định là thời gian hiện tại
    },
}, {
    tableName: 'product',  // Tên bảng trong cơ sở dữ liệu
    timestamps: false,  // Nếu không sử dụng cột createdAt và updatedAt
});

// Thiết lập quan hệ giữa các bảng
Product.belongsTo(Category, { foreignKey: 'category_id' });
Product.belongsTo(Subcategory, { foreignKey: 'subcategory_id' });

module.exports = Product;
