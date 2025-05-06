// models/customer.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js'; // nhớ thêm .js khi dùng ESM

const Customer = sequelize.define('Customer', {
    customer_id: {
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
        defaultValue: DataTypes.NOW,
    },

    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'customer',
    timestamps: false,
});

export default Customer;
