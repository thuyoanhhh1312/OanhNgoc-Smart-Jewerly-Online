const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Import kết nối Sequelize

// Định nghĩa model User
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role_id: {
    type: DataTypes.INTEGER,
    defaultValue: 2, // Mặc định là role_id = 2
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  // Các tùy chọn thêm
  timestamps: false,
  tableName: 'user',
});

module.exports = User;
