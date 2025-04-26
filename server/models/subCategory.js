const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); 
const Category = require('./category');

const SubCategory = sequelize.define('SubCategory', {
    subcategory_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    subcategory_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Category,
            key: 'category_id',
        },
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
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
    tableName: 'sub_category',
    timestamps: false,
});

// ➡️ Thêm dòng này để Sequelize hiểu mối quan hệ:
SubCategory.belongsTo(Category, { foreignKey: 'category_id' });

module.exports = SubCategory;
