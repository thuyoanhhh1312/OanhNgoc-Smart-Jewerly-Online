const Category =  require('../models/category');

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách danh mục", error: error.message });
  }
}

const getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: "Danh mục không tìm thấy" });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh mục", error: error.message });
  }
}

const createCategory = async (req, res) => {
    const {categories_name, description} = req.body;
    try{
        const newCategory = await Category.create({
            categories_name,
            description
        });
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi tạo danh mục", error: error.message });
    }
}

const updateCategory = async (req, res) => {
    const { id } = req.params;
    const { categories_name, description } = req.body;
    try {
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ message: "Danh mục không tìm thấy" });
        }
        category.categories_name = categories_name || category.categories_name;
        category.description = description || category.description;

        await category.save();
        res.status(200).json(category);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi cập nhật danh mục", error: error.message });
    }
}

const deleteCategory = async (req, res) => {
    const { id } = req.params;
    try {
        const category = await Category.findByPk(id);
        if (!category) {
            return res.status(404).json({ message: "Danh mục không tìm thấy" });
        }
        await category.destroy(); //destroy la xoa
        // await Category.destroy({ where: { id } }); // Hoặc bạn có thể sử dụng cách này để xóa
        res.status(200).json({ message: "Danh mục đã được xóa" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi xóa danh mục", error: error.message });
    }
}
module.exports = { 
    getAllCategories, 
    getCategoryById, 
    createCategory, 
    updateCategory, 
    deleteCategory 
};