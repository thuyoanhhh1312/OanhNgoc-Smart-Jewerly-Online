const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Customer = sequelize.define('Customer', {
    customer_id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,  // Tự động tăng
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,  // Đảm bảo email là duy nhất
    },

    phone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },

    address: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,  // Thời gian tạo mặc định là thời gian hiện tại
    },

    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,  // Thời gian cập nhật mặc định là thời gian hiện tại
    },
}, {
    tableName: 'customer',  // Tên bảng trong cơ sở dữ liệu
    timestamps: false,  // Nếu không sử dụng cột createdAt và updatedAt
});
module.exports = Customer;