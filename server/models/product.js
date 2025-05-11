// models/product.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Category from './category.js';
import Subcategory from './subcategory.js';
import ProductImage from './productImage.js';

const Product = sequelize.define('Product', {
    product_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    product_name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
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
    tableName: 'product',
    timestamps: false,
});

// Thiết lập quan hệ
Product.belongsTo(Category, { foreignKey: 'category_id' });
Product.belongsTo(Subcategory, { foreignKey: 'subcategory_id' });
Product.hasMany(ProductImage, { foreignKey: 'product_id' });

export default Product;
