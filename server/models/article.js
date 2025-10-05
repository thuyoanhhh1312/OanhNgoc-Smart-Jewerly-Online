import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Article = sequelize.define('Article', {
  article_id:           { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  article_category_id:  { type: DataTypes.INTEGER, allowNull: false },   // 👈 đổi chỗ này
  title:        { type: DataTypes.STRING(255), allowNull: false },
  slug:         { type: DataTypes.STRING(300), allowNull: false, unique: true },
  excerpt:      { type: DataTypes.TEXT, allowNull: true },
  content:      { type: DataTypes.TEXT('long'), allowNull: false },
  thumbnail_url:{ type: DataTypes.STRING(500), allowNull: true },
  status:       { type: DataTypes.ENUM('draft','published','archived'), defaultValue: 'draft' },
  published_at: { type: DataTypes.DATE, allowNull: true },
  created_at:   { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at:   { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: 'article',
  timestamps: false,
});

export default Article;
