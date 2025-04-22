const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');  // Kết nối với cơ sở dữ liệu

const Category = sequelize.define('Category', {
    category_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,  // Tự động tăng
    },
    category_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,  // Tên category phải là duy nhất
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,  // Mô tả là tùy chọn
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,  // Thời gian tạo mặc định là thời gian hiện tại
    },
    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,  // Thời gian cập nhật mặc định là thời gian hiện tại
    },
},{
    tableName: 'category',  // Tên bảng trong cơ sở dữ liệu
    timestamps: false,  // Nếu không sử dụng cột createdAt và updatedAt
})
module.exports = Category;