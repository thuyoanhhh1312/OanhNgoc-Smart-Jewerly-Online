import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Order = sequelize.define('Order', {
    order_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    customer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },

    promotion_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },

    status_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },

    sub_total: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
    },

    discount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0,
    },

    total: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
    },

    shipping_address: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    payment_method: {
        type: DataTypes.STRING(50),
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
    tableName: 'orders',
    timestamps: false,
});

export default Order;
