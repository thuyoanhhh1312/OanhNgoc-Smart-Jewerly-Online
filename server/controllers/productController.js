import Product from '../models/product.js';
import Category from '../models/category.js';
import SubCategory from '../models/subcategory.js';
import ProductImage from '../models/productImage.js';

export const getAllProducts = async (req, res) => {
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
        },
        {
          model: ProductImage,
          attributes: ['image_id', 'image_url', 'alt_text', 'is_main'],
        },
      ],
    });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách sản phẩm", error: error.message });
  }
};

export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id, {
      include: [
        {
          model: Category,
          attributes: ['category_name'],
        },
        {
          model: SubCategory,
          attributes: ['subcategory_name'],
        },
        {
          model: ProductImage,
          attributes: ['image_id', 'image_url', 'alt_text', 'is_main'],
        },
      ],
    });

    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error('Lỗi khi lấy sản phẩm:', error);
    res.status(500).json({
      message: "Lỗi khi lấy sản phẩm",
      error: error.message,
    });
  }
};


export const createProduct = async (req, res) => {
  try {
    const { product_name, description, price, quantity, category_id, subcategory_id } = req.body;
    const imageFiles = req.files;

    const newProduct = await Product.create({
      product_name,
      description,
      price,
      quantity,
      category_id,
      subcategory_id,
    });

    if (imageFiles && imageFiles.length > 0) {
      const imagesToCreate = imageFiles.map((file, index) => ({
        product_id: newProduct.product_id,
        image_url: file.path,
        alt_text: product_name,
        is_main: index === 0,
      }));
      await ProductImage.bulkCreate(imagesToCreate);
    }

    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Lỗi khi tạo sản phẩm:', error);
    res.status(500).json({ message: "Lỗi khi tạo sản phẩm", error: error.message });
  }
};

export const updateProduct = async (req, res) => {
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
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tìm thấy" });
    }
    await product.destroy();
    res.status(200).json({ message: "Sản phẩm đã được xóa" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa sản phẩm", error: error.message });
  }
};
