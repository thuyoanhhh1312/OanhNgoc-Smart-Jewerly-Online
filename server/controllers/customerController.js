import db from '../models/index.js';

export const upsertCustomerProfile = async (req, res, next) => {
    const { phone, address } = req.body;
    const userId = req.user.id;

    if (!phone) {
        return next({
            statusCode: 400,
            message: "Vui lòng nhập số điện thoại."
        });
    }

    try {
        let customer = await db.Customer.findOne({ where: { user_id: userId } });

        if (customer) {
            customer.phone = phone;
            customer.address = address;
            await customer.save();
        } else {
            const user = await db.User.findByPk(userId);
            customer = await db.Customer.create({
                user_id: user.id,
                name: user.name,
                email: user.email,
                phone,
                address,
            });
        }

        return res.status(200).json({
            message: "Cập nhật thông tin thành công.",
            customer
        });
    } catch (err) {
        return next({
            statusCode: 500,
            message: "Có lỗi khi cập nhật thông tin.",
            error: err.message
        });
    }
};