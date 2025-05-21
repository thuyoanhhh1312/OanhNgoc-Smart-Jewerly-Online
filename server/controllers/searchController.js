import { Op, fn, col, Sequelize } from "sequelize";
import db from "../models/index.js";

export const searchProducts = async (req, res) => {
  try {
    const {
      category,
      subcategory,
      price_min,
      price_max,
      rating_min, // ta sẽ dùng làm max_rating filter
      keyword,
      limit = 20,
      page = 1,
      sort_field = "product_name",
      sort_order = "ASC",
    } = req.query;

    const parsedLimit = Math.min(parseInt(limit, 10) || 20, 100);
    const parsedPage = Math.max(parseInt(page, 10) || 1, 1);
    const offset = (parsedPage - 1) * parsedLimit;

    const whereProduct = {};

    if (category) whereProduct.category_id = category;
    if (subcategory) whereProduct.subcategory_id = subcategory;
    if (price_min || price_max) {
      whereProduct.price = {};
      if (price_min) whereProduct.price[Op.gte] = parseFloat(price_min);
      if (price_max) whereProduct.price[Op.lte] = parseFloat(price_max);
    }
    if (keyword) {
      whereProduct[Op.or] = [{ product_name: { [Op.like]: `%${keyword}%` } }];
    }

    // Filter rating trung bình nhỏ hơn hoặc bằng rating_min (thực ra là ratingMax)
    let havingCondition = undefined;
    if (rating_min && !isNaN(parseFloat(rating_min))) {
      havingCondition = Sequelize.where(
        fn("AVG", col("ProductReviews.rating")),
        {
          [Op.lte]: parseFloat(rating_min), // <= rating_min (là max rating lọc)
        }
      );
    }

    const validSortFields = ["product_name", "price", "avg_rating"];
    const orderField = validSortFields.includes(sort_field)
      ? sort_field
      : "product_name";
    const orderDirection = sort_order.toUpperCase() === "DESC" ? "DESC" : "ASC";

    const products = await db.Product.findAndCountAll({
      where: whereProduct,
      attributes: {
        include: [[fn("AVG", col("ProductReviews.rating")), "avg_rating"]],
      },
      include: [
        {
          model: db.ProductReview,
          attributes: [],
          required: rating_min ? true : false,
        },
        {
          model: db.Category,
          attributes: ["category_id", "category_name"],
        },
        {
          model: db.SubCategory,
          attributes: ["subcategory_id", "subcategory_name"],
        },
        {
          model: db.ProductImage,
          attributes: ["image_url"],
        },
      ],
      group: [
        "Product.product_id",
        "Category.category_id",
        "SubCategory.subcategory_id",
        "ProductImages.image_id",
      ],
      having: havingCondition,
      order: [[orderField, orderDirection]],
      limit: parsedLimit,
      offset,
      subQuery: false,
      distinct: true,
    });

    const totalCount = Array.isArray(products.count)
      ? products.count.length
      : products.count;

    res.json({
      data: products.rows,
      pagination: {
        total: totalCount,
        page: parsedPage,
        limit: parsedLimit,
        totalPages: Math.ceil(totalCount / parsedLimit),
      },
    });
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({ error: "Server error" });
  }
};
