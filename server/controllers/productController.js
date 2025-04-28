const Product = require('../models/product');
const Category = require('../models/category');// Thêm dòng này
const SubCategory = require('../models/subcategory'); // Thêm dòng này

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        {
          model: Category,
          attributes: ['category_name'],
        },
        {
          model: SubCategory,
          attributes: ['subcategory_name'],
        }
      ]
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};

const getProductById = async (req, res) => {
    const { id } = req.params;
    try {
      const product = await Product.findByPk(id);
  
      if (!product) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
      }
  
      res.status(200).json(product); // Quan trọng: trả đúng dữ liệu product
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ message: "Error fetching product", error: error.message });
    }
  };

const createProduct = async (req, res) => {
    const { product_name, description, price, quantity, category_id, subcategory_id } = req.body;
    try {
        const newProduct = await Product.create({
            product_name,
            description,
            price,
            quantity,
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
    const { product_name, description, price, quantity, category_id, subcategory_id } = req.body;
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