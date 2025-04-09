// models/role.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');  // Kết nối với cơ sở dữ liệu

const Role = sequelize.define('Role', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,  // Tự động tăng
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,  // Tên role phải là duy nhất
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,  // Mô tả là tùy chọn
  },
}, {
  tableName: 'role',  // Tên bảng trong cơ sở dữ liệu
  timestamps: false,  // Nếu không sử dụng cột createdAt và updatedAt
});

module.exports = Role;
