export const validateRequest = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });

        if (error) {
            // gom tất cả lỗi validate trả về cho client
            const errors = error.details.map(detail => detail.message);
            return res.status(400).json({ message: 'Validation error', errors });
        }

        // Gán lại body đã được clean (stripUnknown) vào req.body
        req.body = value;
        next();
    };
};