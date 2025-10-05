import db from '../models/index.js';
const { ArticleCategory } = db;

export const getAll = async (req, res, next) => {
  try {
    const rows = await ArticleCategory.findAll({
      order: [['category_name', 'ASC']],
      attributes: ['article_category_id', 'category_name', 'slug'],
    });
    res.json({ data: rows });
  } catch (err) { next(err); }
};
