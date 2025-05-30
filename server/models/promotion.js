import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Promotion = sequelize.define('Promotion', {
    promotion_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    promotion_code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
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
        allowNull: true,
    },

    usage_limit: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    usage_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
    tableName: 'promotion',
    timestamps: false,
});

export default Promotion;
