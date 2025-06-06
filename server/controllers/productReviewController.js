import db from '../models/index.js';
import axios from 'axios';

export const getReviewsByProductId = async (req, res, next) => {
  const productId = req.params.id;

  try {
    const reviews = await db.ProductReview.findAll({
      include: [
        {
          model: db.Customer,
          attributes: ["name", "email", "phone"],
        },
      ],
      where: { product_id: productId },
      order: [['created_at', 'DESC']],
    });

    return res.status(200).json({
      message: 'Lấy danh sách đánh giá thành công',
      reviews,
    });
  } catch (err) {
    return next({
      statusCode: 500,
      message: 'Lỗi lấy danh sách đánh giá',
      error: err.message,
    });
  }
};

export const createReview = async (req, res, next) => {
  const productId = req.params.id;
  const { user_id, rating, content } = req.body;

  const customer = await db.Customer.findOne({
    where: { user_id }
  });

  const customer_id = customer.customer_id;

  if (!customer_id || !rating || !content) {
    return next({
      statusCode: 400,
      message: 'Thiếu dữ liệu bắt buộc: customer_id, rating hoặc nội dung đánh giá',
    });
  }

  try {
    // Gọi API sentiment để phân tích nội dung
    const sentimentRes = await axios.post('http://oanhngocjewelry.online/nlp/sentiment', { text: content });
    const vietnameseLabel = sentimentRes.data.label || null;

    const reverseMapping = {
      "Tích cực": "POS",
      "Tiêu cực": "NEG",
      "Trung tính": "NEU"
    };
    const sentiment = reverseMapping[vietnameseLabel] || null;

    const newReview = await db.ProductReview.create({
      product_id: productId,
      customer_id,
      rating,
      content,
      sentiment,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return res.status(201).json({
      message: 'Tạo đánh giá thành công',
      review: newReview,
    });
  } catch (err) {
    return next({
      statusCode: 500,
      message: 'Lỗi tạo đánh giá',
      error: err.message,
    });
  }
};

export const getReviewSummary = async (req, res, next) => {
  const productId = req.params.id;

  try {
    const reviews = await db.ProductReview.findAll({
      where: { product_id: productId },
      attributes: ['rating', 'sentiment'],
    });

    const totalReviews = reviews.length;
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = totalReviews > 0 ? (totalRating / totalReviews).toFixed(2) : 0;

    // Đếm số lượng review theo sentiment
    const sentimentCount = { POS: 0, NEG: 0, NEU: 0, UNKNOWN: 0 };
    // Đếm số lượng review theo từng mức rating 1..5
    const ratingDistribution = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 };

    reviews.forEach((r) => {
      // Đếm sentiment
      if (r.sentiment && sentimentCount.hasOwnProperty(r.sentiment)) {
        sentimentCount[r.sentiment]++;
      } else {
        sentimentCount.UNKNOWN++;
      }
      // Đếm rating
      if (r.rating && ratingDistribution.hasOwnProperty(r.rating.toString())) {
        ratingDistribution[r.rating.toString()]++;
      }
    });

    return res.status(200).json({
      message: 'Tổng quan đánh giá sản phẩm',
      data: {
        totalReviews,
        avgRating: parseFloat(avgRating),
        sentimentCount,
        ratingDistribution,
      },
    });
  } catch (error) {
    return next({
      statusCode: 500,
      message: 'Lỗi lấy tổng quan đánh giá',
      error: error.message,
    });
  }
};

