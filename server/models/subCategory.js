const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 
const Category = require('./category');

const subCategory = sequelize.define('subCategory', {
    subCategory_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,  // Tự động tăng
    },
    subCategory_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,  // Tên subCategory phải là duy nhất
    },
    Category_id: {
        type: DataTypes.INTEGER,
        references: {//khoa ngoại
            model: Category,  // Tham chiếu đến bảng Category
            key: 'category_id',  // Khóa chính trong bảng Category
        },
        allowNull: false,  // Không cho phép null
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
    tableName: 'sub_category',  // Tên bảng trong cơ sở dữ liệu
    timestamps: false,  // Nếu không sử dụng cột createdAt và updatedAt
})

module.exports = subCategory;