const product = require('../models/product');

const getAllProducts = async (req, res) => {
    try {
        const products = await product.findAll();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách sản phẩm", error: error.message });
        
    }
}

const getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const productItem = await product.findByPk(id);
        if (!productItem) {
            return res.status(404).json({ message: "Sản phẩm không tìm thấy" });
        }
        res.status(200).json(productItem);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy sản phẩm", error: error.message });
    }
}

const createProduct = async (req, res) => {
    const { product_name, description, price, quantity, image_url, category_id, subcategory_id } = req.body;
    try {
        const newProduct = await product.create({
            product_name,
            description,
            price,
            quantity,
            image_url,
            category_id,
            subcategory_id
        });
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi tạo sản phẩm", error: error.message });
    }
}
const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { product_name, description, price, quantity, category_id, subcategory_id, image_url } = req.body;
    try {
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: "Sản phẩm không tìm thấy" });
        }
        product.product_name = product_name || product.product_name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.quantity = quantity || product.quantity;
        product.category_id = category_id || product.category_id;
        product.subcategory_id = subcategory_id || product.subcategory_id;
        product.image_url = image_url || product.image_url;

        await product.save();
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi cập nhật sản phẩm", error: error.message });
    }
}
// Xóa sản phẩm
const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: "Sản phẩm không tìm thấy" });
        }
        await product.destroy(); // Xóa sản phẩm
        // Hoặc có thể sử dụng cách này để xóa: await Product.destroy({ where: { id } });
        res.status(200).json({ message: "Sản phẩm đã được xóa" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi xóa sản phẩm", error: error.message });
    }
}

module.exports = { 
    getAllProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct 
};