import db from '../models/index.js';

export const getAllPromotions = async (req, res) => {
    try {
        const promotions = await db.Promotion.findAll();
        res.status(200).json(promotions);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách khuyến mãi", error: error.message });
    }
};

export const getPromotionById = async (req, res) => {
    const { id } = req.params;
    try {
        const promotion = await db.Promotion.findByPk(id);
        if (!promotion) {
            return res.status(404).json({ message: "Khuyến mãi không tìm thấy" });
        }
        res.status(200).json(promotion);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy khuyến mãi", error: error.message });
    }
};

export const createPromotion = async (req, res) => {
    const { promotion_code, discount, start_date, end_date, description } = req.body;
    try {
        const newPromotion = await db.Promotion.create({
            promotion_code,
            discount,
            start_date,
            end_date,
            description
        });
        res.status(201).json(newPromotion);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi tạo khuyến mãi", error: error.message });
    }
};

export const updatePromotion = async (req, res) => {
    const { id } = req.params;
    const { promotion_code, discount, start_date, end_date, description } = req.body;
    try {
        const promotion = await db.Promotion.findByPk(id);
        if (!promotion) {
            return res.status(404).json({ message: "Khuyến mãi không tìm thấy" });
        }

        promotion.promotion_code = promotion_code || promotion.promotion_code;
        promotion.discount = discount || promotion.discount;
        promotion.start_date = start_date || promotion.start_date;
        promotion.end_date = end_date || promotion.end_date;
        promotion.description = description || promotion.description;

        await promotion.save();
        res.status(200).json(promotion);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi cập nhật khuyến mãi", error: error.message });
    }
};

export const deletePromotion = async (req, res) => {
    const { id } = req.params;
    try {
        const promotion = await db.Promotion.findByPk(id);
        if (!promotion) {
            return res.status(404).json({ message: "Khuyến mãi không tìm thấy" });
        }
        await promotion.destroy();
        res.status(200).json({ message: "Khuyến mãi đã được xóa thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi xóa khuyến mãi", error: error.message });
    }
};
