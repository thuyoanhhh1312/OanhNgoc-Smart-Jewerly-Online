const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Promotion = sequelize.define('Promotion', {
    promotion_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,  // Tự động tăng
    },

    promotion_code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,  // Đảm bảo mã khuyến mãi là duy nhất
    },

    discount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },

    start_date: {
        type: DataTypes.DATE,
        allowNull: false,
    },

    end_date: {
        type: DataTypes.DATE,
        allowNull: false,
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
}, {
    tableName: 'promotion',  // Tên bảng trong cơ sở dữ liệu
    timestamps: false,  // Nếu không sử dụng cột createdAt và updatedAt
});

module.exports = Promotion;